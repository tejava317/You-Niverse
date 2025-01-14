# /backend/app/api/auth.py
# Authentication API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.auth import (
    UserSignUpRequest,
    UserLoginRequest,
    UserLoginResponse,
    GoogleLoginRequest,
    GoogleLoginResponse
)
from app.utils.crypt import generate_user_id, hash_password

router = APIRouter()

# Sign-up for general user
@router.post("/user-sign-up")
async def user_sign_up(request: UserSignUpRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]

        existing_user = collection.find_one({
            "login_type": "general",
            "username": request.username
        })
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        user_id = generate_user_id()
        # hashed_password = hash_password(request.password)
        user_data = {
            "user_id": user_id,
            "login_type": "general",
            "username": request.username,
            "password": request.password,
            "google_email": None,
            "nickname": request.nickname,
            "github_username": None
        }
        result = collection.insert_one(user_data)
        return {"message": "User successfully signed up"}
    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to register user information: {str(e)}")

# Login for general user
@router.post("/user-login", response_model=UserLoginResponse)
async def user_login(request: UserLoginRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]

        user = collection.find_one({
            "login_type": "general",
            "username": request.username
        })
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if request.password == user["password"]:
            return UserLoginResponse(
                message="User successfully logged in",
                user_id=user["user_id"]
            )
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to verify user information: {str(e)}")

# Login for Google user
@router.post("/google-login", response_model=GoogleLoginResponse)
async def google_login(request: GoogleLoginRequest, db=Depends(get_db)):
    try:
        collection = db["user_info"]

        existing_user = collection.find_one({
            "login_type": "google",
            "google_email": request.google_email
        })
        if existing_user:
            return {
                "message": "User successfully logged in",
                "user_id": existing_user["user_id"]
            }

        user_id = generate_user_id()
        user_data = {
            "user_id": user_id,
            "login_type": "general",
            "username": None,
            "password": None,
            "google_email": request.google_email,
            "nickname": request.nickname,
            "github_username": None
        }
        result = collection.insert_one(user_data)
        
        return GoogleLoginResponse(
            message="User successfully logged in",
            user_id=user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify Google user information: {str(e)}")
