from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from models import UserLogin, Token, ApiResponse
from auth_demo import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
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

@router.get("/health")
async def auth_health():
    return {"status": "healthy", "message": "Demo auth service running"}