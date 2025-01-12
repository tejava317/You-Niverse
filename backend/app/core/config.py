# /backend/app/core/config.py
# Initialize environment variable
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    DATABASE_NAME: str

    GITHUB_API_TOKEN: str

    class Config:
        env_file = ".env"

settings = Settings()
