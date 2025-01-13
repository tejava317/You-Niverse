# /backend/app/schemas/github.py
# Define schemas for github API requests and responses
from pydantic import BaseModel

class GitHubUsernameRequest(BaseModel):
    github_username: str

class GitHubRepoRequest(BaseModel):
    owner_username: str
    github_repo: str
