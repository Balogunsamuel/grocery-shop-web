from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class UserRole(str, Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    INITIATED = "initiated"
    PAID = "paid"
    FAILED = "failed"
    EXPIRED = "expired"

# Base Models
class BaseDBModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        populate_by_name = True

# Product Models
class NutritionFacts(BaseModel):
    calories: int
    carbs: str
    fiber: str
    sugar: str
    protein: str
    fat: str

class Product(BaseDBModel):
    name: str
    price: float
    original_price: Optional[float] = None
    image: str
    images: List[str] = []
    rating: float = 0.0
    review_count: int = 0
    category: str
    category_id: str
    brand: str
    in_stock: bool = True
    stock_count: int = 0
    description: str
    features: List[str] = []
    nutrition_facts: NutritionFacts
    tags: List[str] = []
    weight: str
    origin: str
    sku: str

class ProductCreate(BaseModel):
    name: str
    price: float
    original_price: Optional[float] = None
    image: str
    images: List[str] = []
    category: str
    category_id: str
    brand: str
    in_stock: bool = True
    stock_count: int = 0
    description: str
    features: List[str] = []
    nutrition_facts: NutritionFacts
    tags: List[str] = []
    weight: str
    origin: str
    sku: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    category_id: Optional[str] = None
    brand: Optional[str] = None
    in_stock: Optional[bool] = None
    stock_count: Optional[int] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    nutrition_facts: Optional[NutritionFacts] = None
    tags: Optional[List[str]] = None
    weight: Optional[str] = None
    origin: Optional[str] = None
    sku: Optional[str] = None

# Category Models
class Category(BaseDBModel):
    name: str
    icon: str
    color: str
    description: str
    product_count: int = 0

class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str
    description: str

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None

# User Models
class UserAddress(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str

class UserPreferences(BaseModel):
    notifications: bool = True
    marketing: bool = False
    dark_mode: bool = False

class User(BaseDBModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER
    address: Optional[UserAddress] = None
    preferences: UserPreferences = UserPreferences()
    hashed_password: str
    is_verified: bool = False
    avatar: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    address: Optional[UserAddress] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[UserAddress] = None
    preferences: Optional[UserPreferences] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Cart Models
class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    quantity: int
    category: str

class Cart(BaseDBModel):
    user_id: str
    items: List[CartItem] = []
    total_price: float = 0.0
    total_items: int = 0

# Order Models
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    quantity: int
    category: str

class Order(BaseDBModel):
    user_id: str
    items: List[OrderItem]
    total_price: float
    subtotal: float
    tax: float
    delivery_fee: float
    status: OrderStatus = OrderStatus.PENDING
    delivery_address: UserAddress
    payment_method: str
    payment_id: Optional[str] = None
    delivery_option: str = "standard"
    notes: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: UserAddress
    payment_method: str
    delivery_option: str = "standard"
    notes: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None

# Payment Models
class PaymentTransaction(BaseDBModel):
    user_id: Optional[str] = None
    order_id: Optional[str] = None
    session_id: str
    amount: float
    currency: str = "usd"
    payment_status: PaymentStatus = PaymentStatus.PENDING
    stripe_payment_intent_id: Optional[str] = None
    metadata: Dict[str, Any] = {}

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    delivery_address: UserAddress
    payment_method: str = "stripe"
    delivery_option: str = "standard"
    notes: Optional[str] = None

# Response Models
class ApiResponse(BaseModel):
    success: bool
    message: str = ""
    data: Optional[Any] = None

class PaginatedResponse(BaseModel):
    success: bool
    message: str = ""
    data: List[Any] = []
    page: int
    size: int
    total: int
    pages: int

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None