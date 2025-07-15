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
    try:
        if MONGODB_URL.startswith("mongodb+srv://"):
            # For MongoDB Atlas
            client = AsyncIOMotorClient(MONGODB_URL, retryWrites=True, w="majority")
        else:
            # For local MongoDB
            client = AsyncIOMotorClient(MONGODB_URL)
        
        # Test the connection
        await client.admin.command('ping')
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        # Fallback to local MongoDB if Atlas fails
        if MONGODB_URL.startswith("mongodb+srv://"):
            print("Falling back to local MongoDB...")
            client = AsyncIOMotorClient("mongodb://localhost:27017/grocery_db")
        else:
            raise
    
async def close_mongo_connection():
    global client
    if client:
        client.close()

# Database collections
async def get_collection(collection_name: str):
    db = await get_database()
    return db[collection_name]