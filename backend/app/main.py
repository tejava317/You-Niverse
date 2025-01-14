# /backend/app/main.py
# Define main application of Fast API
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, github, project
from app.db.connection import get_db

# Initialize FastAPI application
app = FastAPI(
    title="You:Niverse App Backend API",
    description="Backend API for You:Niverse App",
    version="1.0.0"
)

# CORS 설정
origins = [
    "http://localhost:5176",  # React 개발 서버
    "https://your-production-domain.com"  # 프로덕션 도메인
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 Origin 리스트
    allow_credentials=True,  # 쿠키 허용
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# Register router (Process requests using each handler function)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(project.router, prefix="/api/project", tags=["Project"])

# Root endpoint
@app.get("/")
async def root(db=Depends(get_db)):
    return {"message": "Welcome to You:Niverse Backend API"}
