# /backend/app/api/project.py
# Project API
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.db.connection import get_db
from app.schemas.project import (
    CreateProjectRequest,
    CreateProjectResponse,
    GetProjectInfoResponse,
    GetScrumResponse,
    UpdateScrumRequest,
    UpdateScrumResponse
)
from app.utils.crypt import generate_project_id
from app.utils.github import (
    validate_github_username,
    validate_github_repo
)
from app.utils.project import (
    get_sequential_planet_index,
    compute_project_d_day,
    compute_progress
)

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
        
        if not await validate_github_username(request.owner_username):
            raise HTTPException(status_code=400, detail="Invalid GitHub username")
        if not await validate_github_repo(request.owner_username, request.github_repo):
            raise HTTPException(status_code=400, detail="Invalid GitHub repository")

        project_id = generate_project_id()
        planet_index = get_sequential_planet_index(collection, user_id)
        
        result = collection.insert_one({
            "user_id": user_id,
            "project_id": project_id,
            "project_name": request.project_name,
            "project_start": request.project_start,
            "project_end": request.project_end,
            "owner_username": request.owner_username,
            "github_repo": request.github_repo,
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

@router.get("/load-project-info/{user_id}/{project_id}", response_model=GetProjectInfoResponse)
async def load_project_info(user_id: str, project_id: str, db=Depends(get_db)):
    try:
        project_collection = db["project_info"]

        project = project_collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
        })
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        d_day = compute_project_d_day(project["project_end"])
        progress = compute_progress(project["project_start"], project["project_end"])

        scrum_collection = db["scrum"]
        today_date = datetime.now().strftime("%Y-%m-%d")
        today_scrum = scrum_collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
            "scrum_date": today_date
        })
        if not today_scrum:
            today_scrum = {
                "done": None,
                "todo": None,
                "idea": None
            }
        
        return {
            "message": "Project information successfully retrieved",
            "project_name": project["project_name"],
            "owner_name": project["owner_username"],
            "github_repo": project["github_repo"],
            "d_day": d_day,
            "progress": progress,
            "done": today_scrum.get("done"),
            "todo": today_scrum.get("todo"),
            "idea": today_scrum.get("idea")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load project information: {str(e)}")

@router.get("/load-scrum/{user_id}/{project_id}/{scrum_date}", response_model=GetScrumResponse)
async def load_scrum(user_id: str, project_id: str, scrum_date: str, db=Depends(get_db)):
    try:
        try:
            datetime.strptime(scrum_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Date '{scrum_date}' is not in the correct format (YYYY-MM-DD)")
        
        collection = db["scrum"]

        scrum_data = collection.find_one({
            "user_id": user_id,
            "project_id": project_id,
            "scrum_date": scrum_date
        })
        if not scrum_data:
            scrum_data = {
                "done": None,
                "todo": None,
                "idea": None
            }
        
        return {
            "message": "Scrum data successfully retrieved",
            "done": scrum_data.get("done"),
            "todo": scrum_data.get("todo"),
            "idea": scrum_data.get("idea")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load scrum data: {str(e)}")

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
