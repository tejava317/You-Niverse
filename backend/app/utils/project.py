# /backend/app/utils/project.py
# Utlity functions for project API
from datetime import date, datetime

def get_sequential_planet_index(collection, user_id) -> int:
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"planet_index": 1}},
        {"$group": {
            "_id": None,
            "planet_indices": {"$push": "$planet_index"}
        }}
    ]
    result = collection.aggregate(pipeline).to_list(length=1)

    if not result:
        return 0
    
    existing_indices = result[0]["planet_indices"]

    for i in range(len(existing_indices) + 1):
        if i not in existing_indices:
            return i

    return len(existing_indices)

def compute_project_d_day(project_end: date) -> int:
    today = datetime.now().date()

    if isinstance(project_end, datetime):
        project_end = project_end.date()

    return (project_end - today).days
