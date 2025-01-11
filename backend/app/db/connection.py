# /backend/app/db/session.py
# Connect to MongoDB client
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from core.config import settings

MONGODB_URI = settings.MONGODB_URI
client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))
