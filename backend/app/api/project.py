# /backend/app/api/project.py
# Project API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.project import (
    CreateProjectRequest,
    CreateProjectResponse,
    GetProjectInfoResponse
)
from app.utils.crypt import generate_project_id
from app.utils.project import get_sequential_planet_index, compute_project_d_day

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
        
        result = collection.insert_one({
            "user_id": request.user_id,
            "project_id": project_id,
            "project_name": request.project_name,
            "project_start": request.project_start,
            "project_end": request.project_end,
            "planet_index": planet_index
        })
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

@router.delete("/delete-project/{user_id}/{project_id}")
async def delete_project(user_id: str, project_id: str, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        existing_project = collection.find_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")

        result = collection.delete_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if result.deleted_count == 1:
            return {"message": "Project successfully deleted"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete project")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@router.get("/get-project-info/{user_id}/{project_id}", response_model=GetProjectInfoResponse)
async def get_project_info(user_id: str, project_id: str, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        project = collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
        })
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        d_day = compute_project_d_day(project["project_end"])

        return {
            "message": "Project information successfully retrieved",
            "project_name": project["project_name"],
            "d_day": d_day
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project info: {str(e)}")
