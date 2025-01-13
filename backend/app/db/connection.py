# /backend/app/db/session.py
# Connect to MongoDB client
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.core.config import settings

MONGODB_URI = settings.MONGODB_URI
DATABASE_NAME = settings.DATABASE_NAME

def get_db():
    client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
    db = client[DATABASE_NAME]
    try:
        yield db
    finally:
        client.close()
