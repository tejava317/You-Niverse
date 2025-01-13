# /backend/app/schema/project.py
# Define schemas for project API requests and responses
from pydantic import BaseModel
from datetime import date, datetime

class CreateProjectRequest(BaseModel):
    user_id: str
    project_name: str
    project_start: date
    project_end: date

    def to_mongo_dict(self):
        return {
            "user_id": self.user_id,
            "project_name": self.project_name,
            "project_start": datetime.combine(self.project_start, datetime.min.time()),  # date → datetime 변환
            "project_end": datetime.combine(self.project_end, datetime.min.time())      # date → datetime 변환
        }

class CreateProjectResponse(BaseModel):
    message: str
    project_id: str
    project_name: str
    planet_index: int
