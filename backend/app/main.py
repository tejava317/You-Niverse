# /backend/app/main.py
# Define main application of Fast API
from fastapi import FastAPI, Depends
from app.api import auth, github, project
from app.db.connection import get_db

# Initialize FastAPI application
app = FastAPI(
    title="You:Niverse App Backend API",
    description="Backend API for You:Niverse App",
    version="1.0.0"
)

# Register router (Process requests using each handler function)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(project.router, prefix="/api/project", tags=["Project"])

# Root endpoint
@app.get("/")
async def root(db=Depends(get_db)):
    return {"message": "Welcome to You:Niverse Backend API"}
