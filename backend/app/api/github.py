# /backend/app/api/github.py
# GitHub API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.github import (
    GitHubUsernameRequest,
    LoadStreakResponse,
    LoadCommitsTodayResponse
)
from app.utils.github import (
    validate_github_username,
    compute_streak,
    compute_commits_today
)

router = APIRouter()

@router.post("/register-github-username/{user_id}")
async def register_github_username(user_id: str, request: GitHubUsernameRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]

        existing_user = collection.find_one({
            "user_id": user_id
        })
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        existing_user = collection.find_one({
            "user_id": {"$ne": user_id},
            "github_username": request.github_username
        })
        if existing_user:
            raise HTTPException(status_code=400, detail="GitHub username already exists")
        
        if not await validate_github_username(request.github_username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")

        result = collection.update_one(
            {"user_id": user_id},
            {"$set": {"github_username": request.github_username}}
        )

        if result.modified_count == 1:
            return {"message": "GitHub username successfully registered"}
        else:
            raise HTTPException(status_code=500, detail="Failed to register GitHub username")
    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to register GitHub username: {str(e)}")

@router.get("/load-streak/{user_id}/{project_id}", response_model=LoadStreakResponse)
async def load_streak(user_id: str, project_id: str, db=Depends(get_db)):
    try:
        user_collection = db["user_info"]
        user = user_collection.find_one({
            "user_id": user_id
        })
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        project_collection = db["project_info"]
        project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        streak = await compute_streak(
            project["owner_username"],
            project["github_repo"],
            user["github_username"]
        )
        return LoadStreakResponse(
            message="Streak information loaded successfully",
            streak=streak
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load streak information: {str(e)}")

@router.get("/load-commits-today/{user_id}/{project_id}", response_model=LoadCommitsTodayResponse)
async def load_commits_today(user_id: str, project_id: str, db=Depends(get_db)):
    try:
        user_collection = db["user_info"]
        user = user_collection.find_one({
            "user_id": user_id
        })
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        project_collection = db["project_info"]
        project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        commits_today = await compute_commits_today(
            project["owner_username"],
            project["github_repo"],
            user["github_username"]
        )
        return LoadCommitsTodayResponse(
            message="Today's commit information loaded successfully",
            commits_today=commits_today
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load commits today: {str(e)}")
