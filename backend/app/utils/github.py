# /backend/app/utils/github.py
# Validate GitHub username
from fastapi import HTTPException
from app.core.config import settings
from datetime import datetime, timedelta, timezone
import httpx

GITHUB_API_TOKEN = settings.GITHUB_API_TOKEN

headers = {
    "Authorization": f"Bearer {GITHUB_API_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

async def validate_github_username(username: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.github.com/users/{username}",
                headers=headers
            )
            if response.status_code == 200:
                return True
            elif response.status_code == 404:
                return False
            elif response.status_code == 403:
                raise HTTPException(
                    status_code=503,
                    detail="GitHub API rate limit exceeded. Please try again later."
                )
            else:
                raise HTTPException(
                    status_code=503,
                    detail="Failed to verify GitHub username"
                )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=503,
                detail="Failed to connect to GitHub API"
            )

async def validate_github_repo(owner: str, repo_name: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.github.com/repos/{owner}/{repo_name}",
                headers=headers
            )
            if response.status_code == 200:
                return True
            elif response.status_code == 404:
                return False
            elif response.status_code == 403:
                raise HTTPException(
                    status_code=503,
                    detail="GitHub API rate limit exceeded. Please try again later."
                )
            else:
                raise HTTPException(
                    status_code=503,
                    detail="Failed to verify GitHub repository"
                )
        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail="Failed to connect to GitHub API"
            )

async def load_commits(owner: str, repo: str, author: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    params = {
        "author": author,
        "per_page": 100,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()

from datetime import datetime, timedelta

def count_commits_today(commits):
    # Use KST
    now_kst = datetime.now(timezone.utc) + timedelta(hours=9)
    today_kst = now_kst.date()

    count = 0
    for c in commits:
        commit_date_str = c["commit"]["author"]["date"]
        commit_date_utc = datetime.fromisoformat(commit_date_str.replace("Z", "+00:00"))

        commit_date_kst = commit_date_utc + timedelta(hours=9)

        if commit_date_kst.date() == today_kst:
            count += 1

    return count

def get_consecutive_commit_days(commits):
    date_list = []
    for c in commits:
        commit_date_str = c["commit"]["author"]["date"]
        commit_date = datetime.fromisoformat(commit_date_str.replace("Z", "+00:00"))
        date_list.append(commit_date.date())
    
    unique_dates = sorted(set(date_list), reverse=True)
    if not unique_dates:
        return 0
    
    today = datetime.today().date()
    consecutive_days = 0
    current_day = today

    for d in unique_dates:
        if d == current_day:
            consecutive_days += 1
            current_day -= timedelta(days=1)
        else:
            break

    return consecutive_days

async def compute_commits_today(owner: str, repo: str, author: str):
    commits = await load_commits(owner, repo, author)
    today_count = count_commits_today(commits)
    return today_count

async def compute_streak(owner: str, repo: str, author: str):
    commits = await load_commits(owner, repo, author)
    streak = get_consecutive_commit_days(commits)
    return streak
