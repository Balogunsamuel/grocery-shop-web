from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from models import Order, OrderCreate, OrderUpdate, ApiResponse, PaginatedResponse, User, OrderStatus
from database import get_collection
from auth import get_current_user, get_current_admin_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_user_orders(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Get orders for the current user
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Build query
        query = {"user_id": current_user.id}
        if status:
            query["status"] = status
        
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

@router.get("/{order_id}", response_model=ApiResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific order by ID
    """
    try:
        orders_collection = await get_collection("orders")
        order = await orders_collection.find_one({"_id": order_id, "user_id": current_user.id})
        
        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )
        
        return ApiResponse(
            success=True,
            message="Order retrieved successfully",
            data=order
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get order: {str(e)}"
        )

@router.post("/", response_model=ApiResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new order
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Calculate totals
        subtotal = sum(item.price * item.quantity for item in order_data.items)
        tax = subtotal * 0.1  # 10% tax
        delivery_fee = 5.99 if subtotal < 50 else 0  # Free delivery over $50
        total_price = subtotal + tax + delivery_fee
        
        # Create order
        order = Order(
            user_id=current_user.id,
            items=order_data.items,
            subtotal=subtotal,
            tax=tax,
            delivery_fee=delivery_fee,
            total_price=total_price,
            delivery_address=order_data.delivery_address,
            payment_method=order_data.payment_method,
            delivery_option=order_data.delivery_option,
            notes=order_data.notes
        )
        
        # Insert order into database
        order_dict = order.dict(by_alias=True)
        result = await orders_collection.insert_one(order_dict)
        
        # Get the created order
        created_order = await orders_collection.find_one({"_id": result.inserted_id})
        
        return ApiResponse(
            success=True,
            message="Order created successfully",
            data=created_order
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create order: {str(e)}"
        )

@router.put("/{order_id}", response_model=ApiResponse)
async def update_order(
    order_id: str,
    order_updates: OrderUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update an order (limited updates for customers)
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Check if order exists and belongs to user
        existing_order = await orders_collection.find_one({"_id": order_id, "user_id": current_user.id})
        if not existing_order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )
        
        # Only allow certain updates for customers
        allowed_updates = {}
        if order_updates.notes is not None:
            allowed_updates["notes"] = order_updates.notes
        
        if allowed_updates:
            allowed_updates["updated_at"] = datetime.utcnow()
            await orders_collection.update_one(
                {"_id": order_id},
                {"$set": allowed_updates}
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

@router.delete("/{order_id}", response_model=ApiResponse)
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Cancel an order (only if status is pending)
    """
    try:
        orders_collection = await get_collection("orders")
        
        # Check if order exists and belongs to user
        existing_order = await orders_collection.find_one({"_id": order_id, "user_id": current_user.id})
        if not existing_order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )
        
        # Only allow cancellation if order is pending
        if existing_order["status"] != OrderStatus.PENDING:
            raise HTTPException(
                status_code=400,
                detail="Order cannot be cancelled in current status"
            )
        
        # Update order status to cancelled
        await orders_collection.update_one(
            {"_id": order_id},
            {"$set": {"status": OrderStatus.CANCELLED, "updated_at": datetime.utcnow()}}
        )
        
        return ApiResponse(
            success=True,
            message="Order cancelled successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to cancel order: {str(e)}"
        )