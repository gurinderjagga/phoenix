# 🗄️ Car Commerce Database Setup Guide

## 📊 Database Tables/Models

Your project includes the following MongoDB collections:

### 👤 **Users Collection**
- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (hashed, required)
- **role**: String (user/admin, default: user)
- **avatar**: String (optional)
- **phone**: String (optional)
- **address**: Object (optional)
- **isActive**: Boolean (default: true)
- **timestamps**: createdAt, updatedAt

### 🚗 **Cars Collection**
- **name**: String (required)
- **brand**: String (required)
- **model**: String (required)
- **year**: Number (required)
- **price**: Number (required)
- **description**: String (required)
- **images**: Array of Strings (required)
- **specifications**: Object (engine, horsepower, etc.)
- **stock**: Number (required, default: 1)
- **category**: String (SUV, Sedan, etc.)
- **featured**: Boolean (default: false)
- **reviews**: Array of review objects
- **timestamps**: createdAt, updatedAt

### 📦 **Orders Collection**
- **user**: ObjectId (reference to User)
- **items**: Array of order items (car, quantity, price)
- **totalAmount**: Number (calculated)
- **status**: String (pending, confirmed, etc.)
- **shippingAddress**: Object
- **paymentMethod**: String
- **paymentStatus**: String
- **orderNotes**: String (optional)
- **timestamps**: createdAt, updatedAt

## 🚀 Quick Setup (MongoDB Atlas - Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Create a free account
3. Click "Create" to create a new cluster (free tier is fine)

### Step 2: Set up Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create a user with read/write permissions
3. Note down the username and password

### Step 3: Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)

### Step 4: Get Connection String
1. Go to **Clusters** → **Connect** → **Connect your application**
2. Choose **Node.js** as driver
3. Copy the connection string

### Step 5: Configure Your App
Create a `.env` file in the `backend` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/phoenix?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

Replace the MongoDB URI with your actual connection string from Step 4.

### Step 6: Seed the Database
```bash
cd backend
npm run seed
```

This will create:
- ✅ 6 premium cars with detailed specifications
- ✅ Admin user: `admin@carcommerce.com` / `admin123`
- ✅ Sample reviews and ratings

## 🖥️ Alternative: Local MongoDB Setup

### Option 1: Install MongoDB Community Server
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

### Option 2: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Configure for Local MongoDB
Update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/phoenix
```

## 🧪 Testing the Setup

### Start the Backend
```bash
cd backend
npm start
```

### Test API Endpoints
```bash
# Get all cars
GET http://localhost:5000/api/cars

# Register a new user
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "admin@carcommerce.com",
  "password": "admin123"
}
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User schema
│   ├── Car.js           # Car schema with reviews
│   └── Order.js         # Order schema
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── cars.js          # Car CRUD operations
│   └── orders.js        # Order management
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── scripts/
│   └── seed.js          # Database seeding script
├── server.js            # Main server file
└── setup.js             # Setup helper script
```

## 🎯 Features Included

### User Management
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access (user/admin)
- ✅ Profile management

### Car Management
- ✅ Full CRUD operations
- ✅ Advanced filtering and search
- ✅ Image galleries
- ✅ Detailed specifications
- ✅ Stock management

### Order Processing
- ✅ Complete order lifecycle
- ✅ Multiple payment methods
- ✅ Order status tracking
- ✅ Order history

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive validation
- **CORS**: Cross-origin resource sharing
- **Error Handling**: Proper error responses

## 📊 Sample Data

After running `npm run seed`, you'll have:

**Users:**
- Admin: `admin@carcommerce.com` (password: `admin123`)
- John Doe: `john@example.com` (password: `password123`)
- Jane Smith: `jane@example.com` (password: `password123`)

**Cars:**
- BMW X5 2023 ($65,000)
- Mercedes-Benz C-Class 2023 ($45,000)
- Audi Q7 2023 ($58,000)
- Tesla Model 3 2023 ($42,000)
- Porsche 911 Carrera 2023 ($120,000)
- Ford F-150 2023 ($35,000)

Each car includes specifications and reviews.

## 🚀 Ready to Launch!

Your car commerce platform is now ready with a complete database setup, authentication system, and sample data. Start building your frontend and connect it to these robust API endpoints! 🎉