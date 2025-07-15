# Grocery Ecommerce App

A full-stack grocery ecommerce application with Next.js frontend, FastAPI backend, and MongoDB database.

## Project Structure

- `/app` - Next.js customer-facing ecommerce app
- `/admin-panel` - Next.js admin dashboard
- `/backend` - FastAPI backend API
- `/components` - Shared React components
- `/lib` - Shared utilities and configurations

## Prerequisites

- Node.js 18+ 
- Python 3.8+
- MongoDB (local or MongoDB Atlas)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Install main app dependencies
pnpm install
# or npm install

# Install admin panel dependencies
cd admin-panel
pnpm install
# or npm install
cd ..

# Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Environment Configuration

Create environment files:

**Backend (.env in /backend folder):**
```env
MONGODB_URL=mongodb://localhost:27017/grocery_db
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/grocery_db
SECRET_KEY=your-secret-key-here
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

**Frontend (.env.local in root folder):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

**Admin Panel (.env.local in /admin-panel folder):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Database Setup

Initialize the database:
```bash
cd backend
python init_db.py
python init_data.py  # Optional: seed with sample data
```

### 4. Start Development Servers

Start all services (run each in separate terminals):

**Backend API:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Customer App:**
```bash
pnpm dev
# or npm run dev
```

**Admin Panel:**
```bash
cd admin-panel
pnpm dev
# or npm run dev
```

### 5. Access the Applications

- Customer App: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Production Deployment

### Backend (FastAPI)

1. **Environment Variables:**
   - Set `MONGODB_URL` to your production MongoDB connection string
   - Configure `SECRET_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`

2. **Deploy Options:**
   - **Docker:** Use the FastAPI Docker image
   - **Railway/Render:** Deploy directly from Git
   - **AWS/Google Cloud:** Use container services

3. **Run Command:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Frontend (Next.js Apps)

1. **Environment Variables:**
   - Set `NEXT_PUBLIC_API_URL` to your production API URL
   - Configure Stripe publishable key

2. **Build and Deploy:**
   ```bash
   # Customer App
   pnpm build
   pnpm start
   
   # Admin Panel
   cd admin-panel
   pnpm build
   pnpm start
   ```

3. **Deploy Options:**
   - **Vercel:** Connect your Git repository (recommended)
   - **Netlify:** Build and deploy from Git
   - **AWS/Google Cloud:** Use container or serverless services

### Database

- **MongoDB Atlas:** Recommended for production
- **Self-hosted MongoDB:** Ensure proper backup and security configuration

## Scripts

**Root Package:**
- `pnpm dev` - Start customer app development server
- `pnpm build` - Build customer app for production
- `pnpm start` - Start customer app production server
- `pnpm lint` - Run linting

**Admin Panel:**
- `pnpm dev` - Start admin panel development server
- `pnpm build` - Build admin panel for production
- `pnpm start` - Start admin panel production server

**Backend:**
- `python main.py` - Start FastAPI development server
- `python init_db.py` - Initialize database
- `python init_data.py` - Seed database with sample data
