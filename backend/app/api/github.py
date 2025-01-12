# /backend/app/api/github.py
# GitHub API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.github import GitHubUsernameRequest
from app.utils.github import validate_github_username

router = APIRouter()

@router.post("/register-github-username")
async def register_github_username(request: GitHubUsernameRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]

        existing_user = collection.find_one({
            "user_id": request.user_id
        })
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        existing_user = collection.find_one({
            "user_id": {"$ne": request.user_id},
            "github_username": request.github_username
        })
        if existing_user:
            raise HTTPException(status_code=400, detail="GitHub username already exists")
        
        if not validate_github_username(request.github_username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")

        result = collection.update_one(
            {"user_id": request.user_id},
            {"$set": {"github_username": request.github_username}}
        )

        if result.modified_count == 1:
            return {"message": "GitHub username successfully registered"}
        else:
            raise HTTPException(status_code=500, detail="Failed to register GitHub username")
    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to register GitHub username: {str(e)}")
