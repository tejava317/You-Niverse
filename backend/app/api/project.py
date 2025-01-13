# /backend/app/api/project.py
# Project API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.project import (
    CreateProjectRequest,
    CreateProjectResponse
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

@router.delete("/delete-project/{user_id}/{project_name}")
async def delete_project(user_id: str, project_name: str, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        existing_project = collection.find_one({
            "user_id": user_id,
            "project_name": project_name
        })
        if not existing_project:
            raise HTTPException(status_code=404, detail=f"Project '{project_name}' not found")

        result = collection.delete_one({
            "user_id": user_id,
            "project_name": project_name
        })
        if result.deleted_count == 1:
            return {"message": f"Project '{project_name}' successfully deleted"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete project")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@router.get("/get-project-info/{user_id}/{project_name}")
async def get_project_info(user_id: str, project_name: str, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        project = collection.find_one({
            "user_id": user_id,
            "project_name": project_name,
        })
        if not project:
            raise HTTPException(status_code=404, detail=f"Project '{project_name}' not found")
        
        d_day = compute_project_d_day(project["project_end"])
        return {
            "project_id": project["project_id"],
            "d_day": d_day
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project info: {str(e)}")