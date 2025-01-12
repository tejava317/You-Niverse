# /backend/app/api/auth.py
# Authentication API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.auth import (
    UserSignUpRequest,
    UserLoginRequest,
    GoogleLoginRequest
)
# from app.models.user_info import UserInfo
# from app.schemas.user import KakaoUserInfo

router = APIRouter()

# Sign-up for general user
@router.post("/user-sign-up")
async def user_sign_up(user_info=UserSignUpRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]
        query = {"login_type": "general", "username": user_info.username, "password": user_info.password}

    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to register user information: {str(e)}")

# Login for general user
@router.post("/user-login")
async def user_login(user_info=UserLoginRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]
        query = {"login_type": "general", "username": user_info.username, "password": user_info.password}

    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to verify user information: {str(e)}")

# Login for Google user
@router.post("/google-login")
async def google_login(user_info=GoogleLoginRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]
        query = {"login_type": "google", "google_id": user_info.google_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify Google user information: {str(e)}")
