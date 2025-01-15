# /backend/app/schemas/github.py
# Define schemas for github API requests and responses
from pydantic import BaseModel

class GitHubUsernameRequest(BaseModel):
    github_username: str

class LoadStreakResponse(BaseModel):
    message: str
    streak: int

class LoadCommitsTodayResponse(BaseModel):
    message: str
    commits_today: int
