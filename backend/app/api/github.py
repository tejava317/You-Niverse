# /backend/app/api/github.py
# GitHub API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.github import (
    GitHubUsernameRequest,
    GitHubRepoRequest
)
from app.utils.github import (
    validate_github_username,
    validate_github_repo
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

@router.post("/register-github-repo/{user_id}/{project_id}")
async def register_github_repo(user_id: str, project_id: str, request: GitHubRepoRequest, db=Depends(get_db)):
    try:
        project_collection = db["project_info"]

        existing_project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        existing_project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
            "github_repo": request.github_repo
        })
        if existing_project:
            raise HTTPException(status_code=400, detail="GitHub repository already exists")
        
        if not await validate_github_username(request.owner_username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")
        if not await validate_github_repo(request.owner_username, request.github_repo):
            raise HTTPException(status_code=400, detail="Invalid GitHub repository")
        
        result = project_collection.update_one(
            {"user_id": user_id, "project_id": project_id},
            {"$set": {"github_repo": request.github_repo}}
        )
        if result.modified_count == 1:
            return {"message": "GitHub repository successfully registered"}
        else:
            raise HTTPException(status_code=500, detail="Failed to register GitHub repository")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register GitHub repository: {str(e)}")
