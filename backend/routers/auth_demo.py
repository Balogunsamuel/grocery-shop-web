from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from models import UserLogin, UserCreate, Token, ApiResponse, User, UserRole
from auth_demo import authenticate_user, create_access_token, create_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/login", response_model=ApiResponse)
async def login_user(user_credentials: UserLogin):
    """
    Login user and return access token (Demo version)
    """
    try:
        logger.info(f"Demo login attempt for: {user_credentials.email}")
        
        user = await authenticate_user(user_credentials.email, user_credentials.password)
        if not user:
            logger.warning("Authentication failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f"Authentication successful for: {user.email}")
        
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
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/register", response_model=ApiResponse)
async def register_user(user_data: UserCreate):
    """
    Register a new user (Demo version)
    """
    try:
        logger.info(f"Demo registration attempt for: {user_data.email}")
        
        # Check if user already exists
        from auth_demo import get_user_by_email
        existing_user = await get_user_by_email(user_data.email)
        if existing_user:
            logger.warning("Email already registered")
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        user_dict = {
            "_id": f"user_{len(user_data.email)}",  # Simple ID generation for demo
            "name": user_data.name,
            "email": user_data.email,
            "phone": user_data.phone,
            "role": "customer",
            "hashed_password": hashed_password,
            "is_verified": True
        }
        
        # Save user to demo database
        await create_user(user_dict)
        
        logger.info(f"User registered successfully: {user_data.email}")
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_dict["email"]}, expires_delta=access_token_expires
        )
        
        # Remove password from response
        user_dict.pop("hashed_password", None)
        
        return ApiResponse(
            success=True,
            message="Registration successful",
            data={
                "access_token": access_token,
                "token_type": "bearer", 
                "user": user_dict
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/health")
async def auth_health():
    return {"status": "healthy", "message": "Demo auth service running"}