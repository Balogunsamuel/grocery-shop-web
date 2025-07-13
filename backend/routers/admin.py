from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from models import (
    ApiResponse, PaginatedResponse, User, Order, OrderStatus, 
    OrderUpdate, Product, Category, PaymentTransaction
)
from database import get_collection
from auth import get_current_admin_user
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard", response_model=ApiResponse)
async def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get admin dashboard statistics
    """
    try:
        # Get collections
        orders_collection = await get_collection("orders")
        products_collection = await get_collection("products")
        users_collection = await get_collection("users")
        transactions_collection = await get_collection("payment_transactions")
        
        # Get date ranges
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        this_month = today.replace(day=1)
        last_month = (this_month - timedelta(days=1)).replace(day=1)
        
        # Get statistics
        stats = {}
        
        # Total orders
        total_orders = await orders_collection.count_documents({})
        orders_today = await orders_collection.count_documents({"created_at": {"$gte": today}})
        orders_this_month = await orders_collection.count_documents({"created_at": {"$gte": this_month}})
        orders_last_month = await orders_collection.count_documents({
            "created_at": {"$gte": last_month, "$lt": this_month}
        })
        
        stats["orders"] = {
            "total": total_orders,
            "today": orders_today,
            "this_month": orders_this_month,
            "last_month": orders_last_month
        }
        
        # Total revenue
        pipeline = [
            {"$group": {"_id": None, "total_revenue": {"$sum": "$total_price"}}}
        ]
        revenue_result = await orders_collection.aggregate(pipeline).to_list(length=1)
        total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
        
        # Revenue this month
        pipeline = [
            {"$match": {"created_at": {"$gte": this_month}}},
            {"$group": {"_id": None, "monthly_revenue": {"$sum": "$total_price"}}}
        ]
        monthly_revenue_result = await orders_collection.aggregate(pipeline).to_list(length=1)
        monthly_revenue = monthly_revenue_result[0]["monthly_revenue"] if monthly_revenue_result else 0
        
        stats["revenue"] = {
            "total": total_revenue,
            "this_month": monthly_revenue
        }
        
        # Products
        total_products = await products_collection.count_documents({"is_active": True})
        out_of_stock = await products_collection.count_documents({"is_active": True, "in_stock": False})
        low_stock = await products_collection.count_documents({"is_active": True, "stock_count": {"$lt": 10}})
        
        stats["products"] = {
            "total": total_products,
            "out_of_stock": out_of_stock,
            "low_stock": low_stock
        }
        
        # Users
        total_users = await users_collection.count_documents({"is_active": True, "role": "customer"})
        new_users_today = await users_collection.count_documents({
            "is_active": True,
            "role": "customer",
            "created_at": {"$gte": today}
        })
        
        stats["users"] = {
            "total": total_users,
            "new_today": new_users_today
        }
        
        # Recent orders
        recent_orders = await orders_collection.find({}).sort("created_at", -1).limit(10).to_list(length=10)
        
        # Top products
        pipeline = [
            {"$unwind": "$items"},
            {"$group": {
                "_id": "$items.product_id",
                "name": {"$first": "$items.name"},
                "total_quantity": {"$sum": "$items.quantity"},
                "total_revenue": {"$sum": {"$multiply": ["$items.price", "$items.quantity"]}}
            }},
            {"$sort": {"total_quantity": -1}},
            {"$limit": 5}
        ]
        top_products = await orders_collection.aggregate(pipeline).to_list(length=5)
        
        return ApiResponse(
            success=True,
            message="Dashboard data retrieved successfully",
            data={
                "stats": stats,
                "recent_orders": recent_orders,
                "top_products": top_products
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get dashboard data: {str(e)}"
        )

@router.get("/orders", response_model=PaginatedResponse)
async def get_all_orders(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    user_id: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all orders (Admin only)
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Build query
        query = {}
        if status:
            query["status"] = status
        if user_id:
            query["user_id"] = user_id
        
        # Get total count
        total = await orders_collection.count_documents(query)
        
        # Get orders with pagination
        skip = (page - 1) * size
        orders = await orders_collection.find(query).sort("created_at", -1).skip(skip).limit(size).to_list(length=size)
        
        # Calculate pagination info
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            success=True,
            message="Orders retrieved successfully",
            data=orders,
            page=page,
            size=size,
            total=total,
            pages=pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get orders: {str(e)}"
        )

@router.put("/orders/{order_id}", response_model=ApiResponse)
async def update_order_status(
    order_id: str,
    order_updates: OrderUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update order status (Admin only)
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Check if order exists
        existing_order = await orders_collection.find_one({"_id": order_id})
        if not existing_order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )
        
        # Update order
        update_data = {k: v for k, v in order_updates.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await orders_collection.update_one(
            {"_id": order_id},
            {"$set": update_data}
        )
        
        # Get updated order
        updated_order = await orders_collection.find_one({"_id": order_id})
        
        return ApiResponse(
            success=True,
            message="Order updated successfully",
            data=updated_order
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update order: {str(e)}"
        )

@router.get("/users", response_model=PaginatedResponse)
async def get_all_users(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all users (Admin only)
    """
    try:
        users_collection = await get_collection("users")
        
        # Build query
        query = {"is_active": True}
        if role:
            query["role"] = role
        
        # Get total count
        total = await users_collection.count_documents(query)
        
        # Get users with pagination
        skip = (page - 1) * size
        users = await users_collection.find(query).sort("created_at", -1).skip(skip).limit(size).to_list(length=size)
        
        # Remove passwords from response
        for user in users:
            user.pop("hashed_password", None)
        
        # Calculate pagination info
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            success=True,
            message="Users retrieved successfully",
            data=users,
            page=page,
            size=size,
            total=total,
            pages=pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get users: {str(e)}"
        )

@router.get("/products", response_model=PaginatedResponse)
async def get_all_products_admin(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    include_inactive: bool = Query(False),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all products including inactive ones (Admin only)
    """
    try:
        products_collection = await get_collection("products")
        
        # Build query
        query = {} if include_inactive else {"is_active": True}
        
        # Get total count
        total = await products_collection.count_documents(query)
        
        # Get products with pagination
        skip = (page - 1) * size
        products = await products_collection.find(query).sort("created_at", -1).skip(skip).limit(size).to_list(length=size)
        
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

@router.get("/payments", response_model=PaginatedResponse)
async def get_all_payments(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all payment transactions (Admin only)
    """
    try:
        transactions_collection = await get_collection("payment_transactions")
        
        # Get total count
        total = await transactions_collection.count_documents({})
        
        # Get transactions with pagination
        skip = (page - 1) * size
        transactions = await transactions_collection.find({}).sort("created_at", -1).skip(skip).limit(size).to_list(length=size)
        
        # Calculate pagination info
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            success=True,
            message="Payment transactions retrieved successfully",
            data=transactions,
            page=page,
            size=size,
            total=total,
            pages=pages
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get payment transactions: {str(e)}"
        )