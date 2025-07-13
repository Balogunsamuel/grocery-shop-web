"""
Initialize the database with sample data
"""
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import asyncio
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/grocery_db")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def init_database():
    """Initialize database with sample data"""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.grocery_db
    
    # Clear existing data
    await db.products.delete_many({})
    await db.categories.delete_many({})
    await db.users.delete_many({})
    
    # Create categories
    categories = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Fruits",
            "icon": "🍎",
            "color": "bg-red-100 text-red-800",
            "description": "Fresh, organic fruits",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Vegetables",
            "icon": "🥕",
            "color": "bg-orange-100 text-orange-800",
            "description": "Farm-fresh vegetables",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Dairy",
            "icon": "🥛",
            "color": "bg-blue-100 text-blue-800",
            "description": "Fresh dairy products",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Meat",
            "icon": "🥩",
            "color": "bg-red-100 text-red-800",
            "description": "Premium quality meat",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Bakery",
            "icon": "🍞",
            "color": "bg-yellow-100 text-yellow-800",
            "description": "Fresh baked goods",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Beverages",
            "icon": "🥤",
            "color": "bg-purple-100 text-purple-800",
            "description": "Refreshing drinks",
            "product_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
    ]
    
    # Insert categories
    for category in categories:
        await db.categories.insert_one(category)
    
    # Get category IDs
    category_docs = await db.categories.find({}).to_list(length=None)
    category_map = {cat["name"]: cat["_id"] for cat in category_docs}
    
    # Create products
    products = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Fresh Organic Apples",
            "price": 4.99,
            "original_price": 6.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.5,
            "review_count": 128,
            "category": "Fruits",
            "category_id": category_map["Fruits"],
            "brand": "Organic Farm",
            "in_stock": True,
            "stock_count": 24,
            "description": "Premium quality organic apples sourced directly from certified organic farms.",
            "features": ["100% Organic certified", "Locally sourced", "No pesticides"],
            "nutrition_facts": {
                "calories": 95,
                "carbs": "25g",
                "fiber": "4g",
                "sugar": "19g",
                "protein": "0.5g",
                "fat": "0.3g"
            },
            "tags": ["organic", "fresh", "healthy"],
            "weight": "1 lb",
            "origin": "Local Farm",
            "sku": "APPLE-ORG-001",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Premium Avocados",
            "price": 3.49,
            "original_price": 4.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.8,
            "review_count": 89,
            "category": "Fruits",
            "category_id": category_map["Fruits"],
            "brand": "Fresh Valley",
            "in_stock": True,
            "stock_count": 18,
            "description": "Perfectly ripe avocados with creamy texture and rich flavor.",
            "features": ["Hand-picked for ripeness", "Rich in healthy fats"],
            "nutrition_facts": {
                "calories": 234,
                "carbs": "12g",
                "fiber": "10g",
                "sugar": "1g",
                "protein": "3g",
                "fat": "21g"
            },
            "tags": ["healthy fats", "fresh"],
            "weight": "Each",
            "origin": "California",
            "sku": "AVOC-PREM-002",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Organic Baby Spinach",
            "price": 2.99,
            "original_price": 3.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.3,
            "review_count": 67,
            "category": "Vegetables",
            "category_id": category_map["Vegetables"],
            "brand": "Green Fields",
            "in_stock": True,
            "stock_count": 32,
            "description": "Tender, fresh organic baby spinach leaves.",
            "features": ["Organic certified", "Pre-washed", "High in iron"],
            "nutrition_facts": {
                "calories": 23,
                "carbs": "4g",
                "fiber": "2g",
                "sugar": "0g",
                "protein": "3g",
                "fat": "0g"
            },
            "tags": ["organic", "leafy greens"],
            "weight": "5 oz",
            "origin": "Local Farm",
            "sku": "SPIN-ORG-003",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Organic Whole Milk",
            "price": 4.29,
            "original_price": 4.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.4,
            "review_count": 203,
            "category": "Dairy",
            "category_id": category_map["Dairy"],
            "brand": "Happy Cows",
            "in_stock": True,
            "stock_count": 45,
            "description": "Fresh organic whole milk from grass-fed cows.",
            "features": ["From grass-fed cows", "No rBST hormones"],
            "nutrition_facts": {
                "calories": 150,
                "carbs": "12g",
                "fiber": "0g",
                "sugar": "12g",
                "protein": "8g",
                "fat": "8g"
            },
            "tags": ["organic", "grass-fed"],
            "weight": "1 gallon",
            "origin": "Local Dairy",
            "sku": "MILK-ORG-004",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Artisan Sourdough Bread",
            "price": 5.49,
            "original_price": 6.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.6,
            "review_count": 94,
            "category": "Bakery",
            "category_id": category_map["Bakery"],
            "brand": "Local Bakery",
            "in_stock": True,
            "stock_count": 12,
            "description": "Handcrafted sourdough bread with crispy crust.",
            "features": ["Traditional starter", "Hand-shaped"],
            "nutrition_facts": {
                "calories": 120,
                "carbs": "23g",
                "fiber": "1g",
                "sugar": "1g",
                "protein": "4g",
                "fat": "1g"
            },
            "tags": ["artisan", "sourdough"],
            "weight": "1.5 lb",
            "origin": "Local Bakery",
            "sku": "BREAD-ART-005",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Fresh Orange Juice",
            "price": 4.99,
            "original_price": 5.99,
            "image": "/placeholder.svg?height=300&width=300",
            "images": ["/placeholder.svg?height=300&width=300"],
            "rating": 4.5,
            "review_count": 167,
            "category": "Beverages",
            "category_id": category_map["Beverages"],
            "brand": "Citrus Fresh",
            "in_stock": True,
            "stock_count": 34,
            "description": "Freshly squeezed orange juice, no pulp.",
            "features": ["Freshly squeezed", "No pulp"],
            "nutrition_facts": {
                "calories": 112,
                "carbs": "26g",
                "fiber": "0g",
                "sugar": "21g",
                "protein": "2g",
                "fat": "0.5g"
            },
            "tags": ["fresh", "vitamin C"],
            "weight": "64 oz",
            "origin": "Florida",
            "sku": "JUICE-ORG-006",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        },
    ]
    
    # Insert products
    for product in products:
        await db.products.insert_one(product)
    
    # Create admin user
    admin_user = {
        "_id": str(uuid.uuid4()),
        "name": "Admin User",
        "email": "admin@grocery.com",
        "phone": "+1234567890",
        "role": "admin",
        "hashed_password": get_password_hash("admin123"),
        "is_verified": True,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "preferences": {
            "notifications": True,
            "marketing": False,
            "dark_mode": False
        }
    }
    
    await db.users.insert_one(admin_user)
    
    # Update category product counts
    for category_name, category_id in category_map.items():
        count = await db.products.count_documents({"category_id": category_id, "is_active": True})
        await db.categories.update_one(
            {"_id": category_id},
            {"$set": {"product_count": count}}
        )
    
    print("Database initialized with sample data!")
    print("Admin credentials:")
    print("Email: admin@grocery.com")
    print("Password: admin123")
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(init_database())