# /backend/app/core/config.py
# Initialize environment variable
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str

    class Config:
        env_file = ".env"

settings = Settings()
