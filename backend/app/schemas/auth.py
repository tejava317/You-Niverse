# /backend/app/schemas/auth.py
# Define schemas for authentication API requests and responses
from pydantic import BaseModel

class UserSignUpRequest(BaseModel):
    username: str
    password: str
    nickname: str

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserLoginResponse(BaseModel):
    message: str
    user_id: str

class GoogleLoginRequest(BaseModel):
    google_email: str
    nickname: str

class GoogleLoginResponse(BaseModel):
    message: str
    user_id: str
