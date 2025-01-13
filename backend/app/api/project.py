# /backend/app/api/project.py
# Project API
from fastapi import APIRouter, HTTPException, Depends
from app.db.connection import get_db
from app.schemas.project import (
    CreateProjectRequest,
    CreateProjectResponse,
    GetProjectInfoResponse,
    UpdateScrumRequest,
    UpdateScrumResponse
)
from app.utils.crypt import generate_project_id
from app.utils.project import get_sequential_planet_index, compute_project_d_day

router = APIRouter()

@router.post("/create-project/{user_id}", response_model=CreateProjectResponse)
async def create_project(user_id: str, request: CreateProjectRequest, db=Depends(get_db)):
    try:
        collection = db["project_info"]

        existing_project = collection.find_one({
            "user_id": user_id,
            "project_name": request.project_name
        })
        if existing_project:
            raise HTTPException(status_code=400, detail=f"Project '{request.project_name}' already exists")

        project_id = generate_project_id()
        planet_index = get_sequential_planet_index(collection, user_id)
        
        result = collection.insert_one({
            "user_id": user_id,
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

@router.post("/update-scrum/{user_id}/{project_id}/{field}", response_model=UpdateScrumResponse)
async def update_scrum(user_id: str, project_id: str, field: str, request: UpdateScrumRequest, db=Depends(get_db)):
    try:
        valid_fields = {"done", "todo", "idea"}
        if field not in valid_fields:
            raise HTTPException(status_code=400, detail=f"Invalid field '{field}'. Must be one of {valid_fields}.")
        
        project_collection = db["project_info"]

        project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id
        })
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        scrum_collection = db["scrum"]
        existing_scrum = scrum_collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
            "scrum_date": request.scrum_date
        })

        if not existing_scrum:
            new_scrum_data = {
                "user_id": user_id,
                "project_id": project_id,
                "scrum_date": request.scrum_date,
                "done": None,
                "todo": None,
                "idea": None
            }
            new_scrum_data[field] = request.scrum_update  # 필드 설정
            result = scrum_collection.insert_one(new_scrum_data)
            if result.inserted_id:
                return {
                    "message": "Scrum data successfully created",
                    "scrum_update": request.scrum_update
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to create scrum data")
        
        else:
            result = scrum_collection.update_one(
                {"user_id": user_id, "project_id": project_id, "scrum_date": request.scrum_date},
                {"$set": {field: request.scrum_update}}
            )
            if result.modified_count == 1:
                return {
                    "message": "Scrum data successfully updated",
                    "scrum_update": request.scrum_update
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to update scrum data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update scrum data: {str(e)}")
