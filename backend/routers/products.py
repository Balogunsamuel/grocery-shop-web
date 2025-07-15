from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from models import Product, ProductCreate, ProductUpdate, ApiResponse, PaginatedResponse, User
from database import get_collection
from auth import get_current_user, get_current_admin_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    in_stock: Optional[bool] = None
):
    """
    Get products with pagination and filtering
    """
    try:
        products_collection = await get_collection("products")
        
        # Build query
        query = {"is_active": True}
        if category:
            query["category"] = category
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search]}}
            ]
        if in_stock is not None:
            query["in_stock"] = in_stock
        
        # Get total count
        total = await products_collection.count_documents(query)
        
        # Get products with pagination
        skip = (page - 1) * size
        products = await products_collection.find(query).skip(skip).limit(size).to_list(length=size)
        
        # Calculate pagination info
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            success=True,
            message="Products retrieved successfully",
            data=products,
            page=page,
            size=size,
            total=total,
            pages=pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get products: {str(e)}"
        )

@router.get("/{product_id}", response_model=ApiResponse)
async def get_product(product_id: str):
    """
    Get a specific product by ID
    """
    try:
        products_collection = await get_collection("products")
        product = await products_collection.find_one({"_id": product_id, "is_active": True})
        
        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        
        return ApiResponse(
            success=True,
            message="Product retrieved successfully",
            data=product
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get product: {str(e)}"
        )

@router.post("/", response_model=ApiResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new product (Admin only)
    """
    try:
        products_collection = await get_collection("products")
        
        # Create product
        product = Product(**product_data.dict())
        product_dict = product.dict(by_alias=True)
        
        # Insert product into database
        result = await products_collection.insert_one(product_dict)
        
        # Get the created product
        created_product = await products_collection.find_one({"_id": result.inserted_id})
        
        return ApiResponse(
            success=True,
            message="Product created successfully",
            data=created_product
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create product: {str(e)}"
        )

@router.put("/{product_id}", response_model=ApiResponse)
async def update_product(
    product_id: str,
    product_updates: ProductUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a product (Admin only)
    """
    try:
        products_collection = await get_collection("products")
        
        # Check if product exists
        existing_product = await products_collection.find_one({"_id": product_id, "is_active": True})
        if not existing_product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        
        # Update product
        update_data = {k: v for k, v in product_updates.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await products_collection.update_one(
            {"_id": product_id},
            {"$set": update_data}
        )
        
        # Get updated product
        updated_product = await products_collection.find_one({"_id": product_id})
        
        return ApiResponse(
            success=True,
            message="Product updated successfully",
            data=updated_product
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update product: {str(e)}"
        )

@router.delete("/{product_id}", response_model=ApiResponse)
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a product (Admin only) - Soft delete
    """
    try:
        products_collection = await get_collection("products")
        
        # Check if product exists
        existing_product = await products_collection.find_one({"_id": product_id, "is_active": True})
        if not existing_product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )
        
        # Soft delete product
        await products_collection.update_one(
            {"_id": product_id},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        return ApiResponse(
            success=True,
            message="Product deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete product: {str(e)}"
        )

@router.get("/category/{category_id}", response_model=PaginatedResponse)
async def get_products_by_category(
    category_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    in_stock: Optional[bool] = None
):
    """
    Get products by category with pagination
    """
    try:
        products_collection = await get_collection("products")
        
        # Build query
        query = {"category_id": category_id, "is_active": True}
        if in_stock is not None:
            query["in_stock"] = in_stock
        
        # Get total count
        total = await products_collection.count_documents(query)
        
        # Get products with pagination
        skip = (page - 1) * size
        products = await products_collection.find(query).skip(skip).limit(size).to_list(length=size)
        
        # Calculate pagination info
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            success=True,
            message="Products retrieved successfully",
            data=products,
            page=page,
            size=size,
            total=total,
            pages=pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get products by category: {str(e)}"
        )