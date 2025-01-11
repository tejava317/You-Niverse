# /backend/app/main.py
# Define main application of Fast API
from fastapi import FastAPI

# Initialize FastAPI application
app = FastAPI(
    title="You:Niverse App Backend API",
    description="Backend API for You:Niverse App",
    version="1.0.0"
)
