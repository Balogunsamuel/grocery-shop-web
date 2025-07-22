from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth_demo
from demo_database import demo_db
import os

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

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)