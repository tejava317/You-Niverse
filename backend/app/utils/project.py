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

def compute_project_d_day(project_end: str) -> str:
    try:
        project_end_date = datetime.strptime(project_end, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError(f"Invalid date format for project_end: {project_end} (Expected YYYY-MM-DD)")

    today = datetime.now().date()
    days_diff = (project_end_date - today).days

    if days_diff == 0:
        return "D-Day"
    elif days_diff > 0:
        return f"D-{days_diff}"
    else:
        return f"D+{abs(days_diff)}"

from datetime import datetime

def compute_progress(project_start: str, project_end: str):
    try:
        project_start_date = datetime.strptime(project_start, "%Y-%m-%d").date()
        project_end_date = datetime.strptime(project_end, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError(f"Invalid date format for project_start or project_end (Expected YYYY-MM-DD)")

    today = datetime.today().date()

    if today < project_start_date:
        return 0.00
    elif today > project_end_date:
        return 100.00
    else:
        total_days = (project_end_date - project_start_date).days
        elapsed_days = (today - project_start_date).days
        progress = elapsed_days / total_days * 100
        return round(progress, 2)

if __name__ == "__main__":
    print(compute_progress("2022-12-01", "2022-12-25"))
