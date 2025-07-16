# 🛒 Grocery Ecommerce Platform

A full-stack grocery ecommerce platform with separate customer and admin interfaces, built with Next.js, FastAPI, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 🛍️ Customer App
- **Product Browsing**: Browse products by categories with filtering and search
- **Shopping Cart**: Add/remove items with real-time cart updates
- **User Authentication**: Register and login functionality
- **Order Management**: Place orders and track order history
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Mobile-first responsive UI

### 🛡️ Admin Panel
- **Product Management**: Create, update, delete products with full details
- **Category Management**: Manage product categories with icons and colors
- **Order Management**: View and update order statuses
- **User Management**: View customer accounts and order history
- **Dashboard Analytics**: Sales metrics and inventory tracking
- **Real-time Sync**: All changes instantly reflected in customer app

### 🔧 Backend API
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Database**: MongoDB with async operations
- **Authentication**: JWT-based auth with role based access
- **Data Validation**: Pydantic models for request/response validation
- **CORS Support**: Configured for cross-origin requests

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer App  │    │   Admin Panel   │    │   Backend API   │
│   (Next.js)     │    │   (Next.js)     │    │   (FastAPI)     │
│   Port: 3001    │    │   Port: 3000    │    │   Port: 8000    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │   MongoDB     │
                         │   Database    │
                         └───────────────┘
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd grocery-app-admin-backend
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

**Environment Variables (.env):**
```env
MONGODB_URL=mongodb://localhost:27017/grocery_db
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

```bash
# Initialize database with sample data
python init_data.py

# Start the backend server
python main.py
```

Backend will be available at: `http://localhost:8000`

### 3. Customer App Setup

```bash
# From project root directory
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start customer app
npm run dev -- --port 3001
```

Customer App will be available at: `http://localhost:3001`

### 4. Admin Panel Setup

```bash
# Navigate to admin panel directory
cd admin-panel

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start admin panel
npm run dev
```

Admin Panel will be available at: `http://localhost:3000`

### 5. Default Admin Credentials

```
Email: admin@grocery.com
Password: admin123
```

## 🌐 Production Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. **Prepare for deployment:**
```bash
cd backend
pip freeze > requirements.txt
```

2. **Environment Variables:**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/grocery_db
JWT_SECRET_KEY=production-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PORT=8000
```

3. **Deploy using your preferred platform:**

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Docker:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

### Frontend Deployment (Vercel/Netlify)

1. **Build and deploy customer app:**
```bash
# Update environment variables
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.com" > .env.local

# Deploy to Vercel
npm install -g vercel
vercel --prod
```

2. **Build and deploy admin panel:**
```bash
cd admin-panel
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.com" > .env.local
vercel --prod
```

### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Whitelist your deployment IPs
3. Create database user with read/write permissions
4. Update `MONGODB_URL` in your environment variables

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - Get all products (with pagination)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

#### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order status (Admin only)

#### Admin
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders with filters

## 📁 Project Structure

```
grocery-app-admin-backend/
├── backend/                 # FastAPI backend
│   ├── routers/            # API route handlers
│   ├── models.py           # Pydantic models
│   ├── database.py         # Database configuration
│   ├── auth.py             # Authentication logic
│   ├── main.py             # FastAPI app entry point
│   └── requirements.txt    # Python dependencies
├── admin-panel/            # Next.js admin interface
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API client
│   └── package.json        # Node.js dependencies
├── app/                    # Next.js customer app
│   ├── api/                # API route handlers
│   ├── components/         # React components
│   └── lib/                # Utilities and types
├── components/             # Shared UI components
├── lib/                    # Shared utilities
├── public/                 # Static assets
└── README.md               # This file
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives
- **Zustand** - State management
- **React Hook Form** - Form handling

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend deployment
- **MongoDB Atlas** - Database hosting

## 🔧 Troubleshooting

### Common Issues

#### 1. Products not showing in customer app
**Solution:** Ensure all three services are running on correct ports:
- Backend: `http://localhost:8000`
- Customer App: `http://localhost:3001`
- Admin Panel: `http://localhost:3000`

#### 2. API requests failing
**Solution:** Check environment variables:
```bash
# Verify NEXT_PUBLIC_API_URL in both apps
echo $NEXT_PUBLIC_API_URL
```

#### 3. Database connection issues
**Solution:** Verify MongoDB is running and connection string is correct:
```bash
# Test MongoDB connection
python -c "from motor.motor_asyncio import AsyncIOMotorClient; print('MongoDB accessible')"
```

#### 4. Authentication errors
**Solution:** Ensure JWT secret is set and admin user exists:
```bash
cd backend
python init_data.py  # Recreates admin user
```

#### 5. Build errors in production
**Solution:** Check Node.js and Python versions match requirements:
```bash
node --version  # Should be v18+
python --version  # Should be 3.8+
```

### Logs and Debugging

#### Backend Logs
```bash
cd backend
python main.py  # Check console output for errors
```

#### Frontend Logs
```bash
# Customer app
npm run dev -- --port 3001

# Admin panel
cd admin-panel
npm run dev
```

#### Database Logs
```bash
# MongoDB logs (if running locally)
tail -f /var/log/mongodb/mongod.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Documentation](#api-documentation)
3. Open an issue on GitHub with:
   - Error messages
   - Steps to reproduce
   - Environment details (OS, Node.js version, etc.)

---

**Happy Coding! 🚀**
