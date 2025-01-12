from app.core.config import settings

GITHUB_API_TOKEN = settings.GITHUB_API_TOKEN

def validate_github_username(username: str):
    return True
