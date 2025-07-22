# Simple in-memory database for demo purposes
from typing import Dict, List, Optional
from models import User, Product, Category, UserRole
from auth import get_password_hash
import json

# In-memory storage
users_db: Dict[str, dict] = {}
products_db: Dict[str, dict] = {}
categories_db: Dict[str, dict] = {}

# Initialize with demo data
def init_demo_data():
    # Create admin user
    admin_user = {
        "_id": "admin_001",
        "name": "Admin User",
        "email": "admin@grocery.com", 
        "phone": "+1234567890",
        "role": "admin",
        "hashed_password": get_password_hash("admin123"),
        "is_verified": True
    }
    users_db["admin@grocery.com"] = admin_user
    
    # Create sample categories
    categories = [
        {"_id": "cat_1", "name": "Fruits", "icon": "🍎", "color": "bg-red-100 text-red-800"},
        {"_id": "cat_2", "name": "Vegetables", "icon": "🥕", "color": "bg-orange-100 text-orange-800"},
        {"_id": "cat_3", "name": "Dairy", "icon": "🥛", "color": "bg-blue-100 text-blue-800"}
    ]
    
    for cat in categories:
        categories_db[cat["_id"]] = cat
    
    # Create sample products  
    products = [
        {
            "_id": "prod_1",
            "name": "Fresh Organic Apples",
            "price": 4.99,
            "category": "Fruits",
            "category_id": "cat_1",
            "in_stock": True,
            "stock_count": 24,
            "description": "Premium quality organic apples",
            "image": "/placeholder.svg?height=300&width=300",
            "is_active": True
        },
        {
            "_id": "prod_2", 
            "name": "Organic Baby Spinach",
            "price": 2.99,
            "category": "Vegetables", 
            "category_id": "cat_2",
            "in_stock": True,
            "stock_count": 32,
            "description": "Tender, fresh organic baby spinach leaves",
            "image": "/placeholder.svg?height=300&width=300",
            "is_active": True
        }
    ]
    
    for prod in products:
        products_db[prod["_id"]] = prod

# Database operations
class DemoDatabase:
    def __init__(self):
        init_demo_data()
    
    async def find_user_by_email(self, email: str) -> Optional[dict]:
        return users_db.get(email)
    
    async def create_user(self, user_data: dict) -> dict:
        users_db[user_data["email"]] = user_data
        return user_data
    
    async def get_products(self, skip: int = 0, limit: int = 10) -> List[dict]:
        products = list(products_db.values())
        return products[skip:skip+limit]
    
    async def get_categories(self) -> List[dict]:
        return list(categories_db.values())
    
    async def get_product_by_id(self, product_id: str) -> Optional[dict]:
        return products_db.get(product_id)

# Global demo database instance
demo_db = DemoDatabase()