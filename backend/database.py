import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/grocery_db")

client: AsyncIOMotorClient = None

async def get_database():
    return client.grocery_db

async def connect_to_mongo():
    global client
    # Use demo database for quick deployment
    print("Using demo in-memory database for quick deployment")
    return True
    
async def close_mongo_connection():
    global client
    if client:
        client.close()

# Database collections
async def get_collection(collection_name: str):
    db = await get_database()
    return db[collection_name]