from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models import Category, CategoryCreate, CategoryUpdate, ApiResponse, User
from ..database import get_collection
from ..auth import get_current_admin_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=ApiResponse)
async def get_categories():
    """
    Get all active categories
    """
    try:
        categories_collection = await get_collection("categories")
        categories = await categories_collection.find({"is_active": True}).to_list(length=None)
        
        return ApiResponse(
            success=True,
            message="Categories retrieved successfully",
            data=categories
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get categories: {str(e)}"
        )

@router.get("/{category_id}", response_model=ApiResponse)
async def get_category(category_id: str):
    """
    Get a specific category by ID
    """
    try:
        categories_collection = await get_collection("categories")
        category = await categories_collection.find_one({"_id": category_id, "is_active": True})
        
        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
        
        return ApiResponse(
            success=True,
            message="Category retrieved successfully",
            data=category
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get category: {str(e)}"
        )

@router.post("/", response_model=ApiResponse)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new category (Admin only)
    """
    try:
        categories_collection = await get_collection("categories")
        
        # Create category
        category = Category(**category_data.dict())
        category_dict = category.dict(by_alias=True)
        
        # Insert category into database
        result = await categories_collection.insert_one(category_dict)
        
        # Get the created category
        created_category = await categories_collection.find_one({"_id": result.inserted_id})
        
        return ApiResponse(
            success=True,
            message="Category created successfully",
            data=created_category
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create category: {str(e)}"
        )

@router.put("/{category_id}", response_model=ApiResponse)
async def update_category(
    category_id: str,
    category_updates: CategoryUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a category (Admin only)
    """
    try:
        categories_collection = await get_collection("categories")
        
        # Check if category exists
        existing_category = await categories_collection.find_one({"_id": category_id, "is_active": True})
        if not existing_category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
        
        # Update category
        update_data = {k: v for k, v in category_updates.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await categories_collection.update_one(
            {"_id": category_id},
            {"$set": update_data}
        )
        
        # Get updated category
        updated_category = await categories_collection.find_one({"_id": category_id})
        
        return ApiResponse(
            success=True,
            message="Category updated successfully",
            data=updated_category
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update category: {str(e)}"
        )

@router.delete("/{category_id}", response_model=ApiResponse)
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a category (Admin only) - Soft delete
    """
    try:
        categories_collection = await get_collection("categories")
        
        # Check if category exists
        existing_category = await categories_collection.find_one({"_id": category_id, "is_active": True})
        if not existing_category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
        
        # Soft delete category
        await categories_collection.update_one(
            {"_id": category_id},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        return ApiResponse(
            success=True,
            message="Category deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete category: {str(e)}"
        )