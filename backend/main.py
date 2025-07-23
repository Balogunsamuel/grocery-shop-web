from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth_demo
from demo_database import demo_db
import os
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="Grocery Ecommerce API - Demo Version",
    description="Demo Backend API for Grocery Ecommerce Application",
    version="1.0.0-demo"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include demo routers
app.include_router(auth_demo.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "Grocery Ecommerce Demo API is running", "version": "demo"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Demo API is running"}

# Demo products endpoint
@app.get("/api/products")
async def get_products():
    try:
        products = await demo_db.get_products()
        return {
            "success": True,
            "message": "Products retrieved successfully",
            "data": products
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

# Demo categories endpoint  
@app.get("/api/categories")
async def get_categories():
    try:
        categories = await demo_db.get_categories()
        return {
            "success": True,
            "message": "Categories retrieved successfully", 
            "data": categories
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

# Demo admin endpoints
@app.get("/api/admin/dashboard")
async def admin_dashboard():
    return {
        "success": True,
        "data": {
            "total_products": 2,
            "total_categories": 3,
            "total_users": 1,
            "total_orders": 0
        }
    }

@app.get("/api/admin/products")
async def admin_get_products():
    try:
        products = await demo_db.get_products()
        return {
            "success": True,
            "message": "Products retrieved successfully",
            "data": products,
            "total": len(products)
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

# Product creation model
class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    category_id: str
    description: str
    stock_count: int
    image: Optional[str] = "/placeholder.svg?height=300&width=300"
    in_stock: Optional[bool] = True
    is_active: Optional[bool] = True

@app.post("/api/admin/products")
async def create_product(product: ProductCreate):
    try:
        product_data = product.dict()
        new_product = await demo_db.create_product(product_data)
        return {
            "success": True,
            "message": "Product created successfully",
            "data": new_product
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

@app.put("/api/admin/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate):
    try:
        product_data = product.dict()
        updated_product = await demo_db.update_product(product_id, product_data)
        if updated_product:
            return {
                "success": True,
                "message": "Product updated successfully",
                "data": updated_product
            }
        else:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Product not found"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

@app.delete("/api/admin/products/{product_id}")
async def delete_product(product_id: str):
    try:
        success = await demo_db.delete_product(product_id)
        if success:
            return {
                "success": True,
                "message": "Product deleted successfully"
            }
        else:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Product not found"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error: {str(e)}"}
        )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)