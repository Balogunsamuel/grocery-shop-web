from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from datetime import timedelta, datetime
from models import User, UserCreate, UserLogin, Token, ApiResponse, UserRole
from database import get_collection
from auth import authenticate_user, create_access_token, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from bson import ObjectId

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=ApiResponse)
async def register_user(user_data: UserCreate):
    """
    Register a new user
    """
    try:
        users_collection = await get_collection("users")
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        user = User(
            name=user_data.name,
            email=user_data.email,
            phone=user_data.phone,
            hashed_password=hashed_password,
            address=user_data.address,
            role=UserRole.CUSTOMER
        )
        
        # Insert user into database
        user_dict = user.model_dump(by_alias=True) if hasattr(user, 'model_dump') else user.dict(by_alias=True)
        await users_collection.insert_one(user_dict)
        
        # Remove password from response
        user_dict.pop("hashed_password", None)
        
        return ApiResponse(
            success=True,
            message="User registered successfully",
            data=user_dict
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to register user: {str(e)}"
        )

@router.post("/login", response_model=ApiResponse)
async def login_user(user_credentials: UserLogin):
    """
    Login user and return access token
    """
    try:
        print(f"Login attempt for email: {user_credentials.email}")
        user = await authenticate_user(user_credentials.email, user_credentials.password)
        if not user:
            print("Authentication failed - user not found or wrong password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"User authenticated successfully: {user.email}")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        # Remove password from user data
        user_dict = user.model_dump() if hasattr(user, 'model_dump') else user.dict()
        user_dict.pop("hashed_password", None)
        
        return ApiResponse(
            success=True,
            message="Login successful",
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": user_dict
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to login: {str(e)}"
        )

@router.get("/me", response_model=ApiResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information
    """
    try:
        user_dict = current_user.dict()
        user_dict.pop("hashed_password", None)
        
        return ApiResponse(
            success=True,
            message="User information retrieved successfully",
            data=user_dict
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user info: {str(e)}"
        )

@router.put("/me", response_model=ApiResponse)
async def update_current_user(
    user_updates: dict,
    current_user: User = Depends(get_current_user)
):
    """
    Update current user information
    """
    try:
        users_collection = await get_collection("users")
        
        # Update user in database
        await users_collection.update_one(
            {"_id": current_user.id},
            {"$set": {**user_updates, "updated_at": datetime.utcnow()}}
        )
        
        # Get updated user
        updated_user = await users_collection.find_one({"_id": current_user.id})
        updated_user.pop("hashed_password", None)
        
        return ApiResponse(
            success=True,
            message="User updated successfully",
            data=updated_user
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update user: {str(e)}"
        )