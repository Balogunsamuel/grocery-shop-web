"""
Demo authentication module using in-memory database
"""
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from models import User, UserRole
from typing import Optional
import os

# Demo database
demo_users = {
    "admin@grocery.com": {
        "_id": "admin_001",
        "name": "Admin User",
        "email": "admin@grocery.com",
        "phone": "+1234567890",
        "role": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # admin123
        "is_verified": True
    }
}

SECRET_KEY = os.getenv("SECRET_KEY", "TtaxEE1DHteKFhfisxsjMyjjbg1GeDa4sUj8Jvt_wa4")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user_by_email(email: str) -> Optional[dict]:
    return demo_users.get(email)

async def authenticate_user(email: str, password: str):
    user_data = await get_user_by_email(email)
    if not user_data:
        return False
    if not verify_password(password, user_data["hashed_password"]):
        return False
    return User(**user_data)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def create_user(user_data: dict):
    """Create a new user in demo database"""
    demo_users[user_data["email"]] = user_data
    return user_data