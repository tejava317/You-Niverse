from fastapi import HTTPException
from app.core.config import settings
import httpx

GITHUB_API_TOKEN = settings.GITHUB_API_TOKEN

async def validate_github_username(username: str):
    headers = {
        "Authorization": f"Bearer {GITHUB_API_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

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
