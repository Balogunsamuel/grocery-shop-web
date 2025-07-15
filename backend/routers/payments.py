from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
# from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest as StripeCheckoutRequest
import stripe
from models import PaymentTransaction, PaymentStatus, ApiResponse, User
from database import get_collection
from auth import get_current_user
import os
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

router = APIRouter()

# Initialize Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
if not STRIPE_SECRET_KEY:
    raise ValueError("STRIPE_SECRET_KEY environment variable is required")

stripe.api_key = STRIPE_SECRET_KEY

from pydantic import BaseModel

class CheckoutSessionRequest(BaseModel):
    amount: Optional[float] = None
    currency: str = "usd"
    stripe_price_id: Optional[str] = None
    quantity: int = 1
    metadata: Optional[Dict[str, Any]] = None

@router.post("/checkout/session")
async def create_checkout_session(
    request: Request,
    checkout_data: CheckoutSessionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Create a Stripe checkout session for payment
    """
    try:
        # Get the host header from the request
        host = request.headers.get("host", "localhost:3000")
        protocol = "https" if request.headers.get("x-forwarded-proto") == "https" else "http"
        base_url = f"{protocol}://{host}"
        
        # Generate success and cancel URLs
        success_url = f"{base_url}/order-confirmation?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{base_url}/cart"
        
        # Prepare metadata
        metadata = checkout_data.metadata or {}
        metadata.update({
            "user_id": current_user.id,
            "user_email": current_user.email,
            "source": "grocery_ecommerce"
        })
        
        # Create checkout session request
        if checkout_data.amount is not None:
            # Custom amount checkout
            checkout_request = StripeCheckoutRequest(
                amount=checkout_data.amount,
                currency=checkout_data.currency,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )
        else:
            # Fixed price checkout
            if not checkout_data.stripe_price_id:
                raise HTTPException(
                    status_code=400,
                    detail="Either amount or stripe_price_id must be provided"
                )
            
            checkout_request = StripeCheckoutRequest(
                stripe_price_id=checkout_data.stripe_price_id,
                quantity=checkout_data.quantity,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )
        
        # Create checkout session with Stripe
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Store payment transaction in database
        payment_transaction = PaymentTransaction(
            user_id=current_user.id,
            session_id=session.session_id,
            amount=checkout_data.amount or 0.0,  # For fixed price, amount will be updated when status is checked
            currency=checkout_data.currency,
            payment_status=PaymentStatus.INITIATED,
            metadata=metadata
        )
        
        transactions_collection = await get_collection("payment_transactions")
        await transactions_collection.insert_one(payment_transaction.dict(by_alias=True))
        
        return ApiResponse(
            success=True,
            message="Checkout session created successfully",
            data={
                "url": session.url,
                "session_id": session.session_id
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create checkout session: {str(e)}"
        )

@router.get("/checkout/status/{session_id}")
async def get_checkout_status(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get the status of a checkout session
    """
    try:
        # Get checkout status from Stripe
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Find the payment transaction in database
        transactions_collection = await get_collection("payment_transactions")
        transaction = await transactions_collection.find_one({
            "session_id": session_id,
            "user_id": current_user.id
        })
        
        if not transaction:
            raise HTTPException(
                status_code=404,
                detail="Payment transaction not found"
            )
        
        # Update payment status based on Stripe response
        new_status = PaymentStatus.PENDING
        if checkout_status.payment_status == "paid":
            new_status = PaymentStatus.PAID
        elif checkout_status.status == "expired":
            new_status = PaymentStatus.EXPIRED
        elif checkout_status.payment_status == "failed":
            new_status = PaymentStatus.FAILED
        
        # Update transaction in database (only if status changed)
        if transaction["payment_status"] != new_status:
            await transactions_collection.update_one(
                {"session_id": session_id, "user_id": current_user.id},
                {
                    "$set": {
                        "payment_status": new_status,
                        "amount": checkout_status.amount_total / 100,  # Convert from cents
                        "currency": checkout_status.currency,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
        return ApiResponse(
            success=True,
            message="Checkout status retrieved successfully",
            data={
                "session_id": session_id,
                "status": checkout_status.status,
                "payment_status": checkout_status.payment_status,
                "amount_total": checkout_status.amount_total,
                "currency": checkout_status.currency,
                "metadata": checkout_status.metadata
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get checkout status: {str(e)}"
        )

@router.get("/transactions")
async def get_user_transactions(
    current_user: User = Depends(get_current_user)
):
    """
    Get all payment transactions for the current user
    """
    try:
        transactions_collection = await get_collection("payment_transactions")
        transactions = await transactions_collection.find({
            "user_id": current_user.id
        }).sort("created_at", -1).to_list(length=100)
        
        return ApiResponse(
            success=True,
            message="Transactions retrieved successfully",
            data=transactions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get transactions: {str(e)}"
        )

@router.get("/transactions/{transaction_id}")
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific payment transaction
    """
    try:
        transactions_collection = await get_collection("payment_transactions")
        transaction = await transactions_collection.find_one({
            "_id": transaction_id,
            "user_id": current_user.id
        })
        
        if not transaction:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found"
            )
        
        return ApiResponse(
            success=True,
            message="Transaction retrieved successfully",
            data=transaction
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get transaction: {str(e)}"
        )