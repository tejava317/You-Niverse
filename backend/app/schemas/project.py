# /backend/app/schema/project.py
# Define schemas for project API requests and responses
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime

class CreateProjectRequest(BaseModel):
    project_name: str
    project_start: str = Field(..., description="Start date in YYYY-MM-DD format")
    project_end: str = Field(..., description="End date in YYYY-MM-DD format")
    owner_username: str
    github_repo: str

    @field_validator("project_start", "project_end")
    def validate_date_format(cls, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            raise ValueError(f"Date '{value}' is not in the correct format (YYYY-MM-DD)")

    @model_validator(mode="after")
    def validate_date_order(cls, values):
        start = datetime.strptime(values.project_start, "%Y-%m-%d")
        end = datetime.strptime(values.project_end, "%Y-%m-%d")
        if start > end:
            raise ValueError("Start date must be earlier than or equal to end date")
        return values

class CreateProjectResponse(BaseModel):
    message: str
    project_id: str
    project_name: str
    planet_index: int

class GetProjectInfoResponse(BaseModel):
    message: str
    project_name: str
    owner_name: str
    github_repo: str
    d_day: str
    progress: float
    done: str | None
    todo: str | None
    idea: str | None

class GetScrumResponse(BaseModel):
    message: str
    done: str | None
    todo: str | None
    idea: str | None

class UpdateScrumRequest(BaseModel):
    scrum_date: str = Field(..., description="Scrum date in YYYY-MM-DD format")
    scrum_update: str

    @field_validator("scrum_date")
    def validate_date_format(cls, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
            return value
        except ValueError:
            raise ValueError(f"Date '{value}' is not in the correct format (YYYY-MM-DD)")

class UpdateScrumResponse(BaseModel):
    message: str
    scrum_update: str
