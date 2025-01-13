# /backend/app/api/project.py
# Project API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.project import (
    CreateProjectRequest,
    CreateProjectResponse
)
from app.utils.crypt import generate_project_id
from app.utils.project import get_sequential_planet_index

router = APIRouter()

@router.post("/create-project", response_model=CreateProjectResponse)
async def create_project(request: CreateProjectRequest, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        existing_project = collection.find_one({
            "user_id": request.user_id,
            "project_name": request.project_name
        })
        if existing_project:
            raise HTTPException(status_code=400, detail=f"Project '{request.project_name}' already exists")

        project_id = generate_project_id()
        planet_index = get_sequential_planet_index(collection, request.user_id)

        project_data = request.to_mongo_dict()
        project_data.update({
            "project_id": project_id,
            "planet_index": planet_index
        })
        
        result = collection.insert_one(project_data)
        if result.inserted_id:
            return {
                "message": "Project successfully created",
                "project_id": project_id,
                "project_name": request.project_name,
                "planet_index": planet_index
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create project")
    except Exception as e:
        # Rollback database
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")
