# 🚗 Phoenix

A modern, full-stack e-commerce application for buying and selling cars, built with React, Node.js, and **Supabase**!

## ✨ Features

### 🎨 Frontend (React + Tailwind CSS)
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Car Listings**: Browse cars with advanced filtering and search
- **Car Details**: Detailed car pages with specifications and reviews
- **Shopping Cart**: Add cars to cart and manage quantities
- **User Authentication**: Seamless login and registration
- **User Profile**: Manage personal information and view order history
- **Order Management**: View and track orders
- **Real-time Updates**: Live data synchronization

### ⚡ Backend (Node.js + Express + Supabase)
- **RESTful API**: Complete API for cars, users, orders, and authentication
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **User Management**: Registration, login, profile management
- **Car Management**: Full CRUD operations for car listings
- **Order Processing**: Complete order lifecycle management
- **Authentication**: Supabase Auth with role-based access
- **Row Level Security**: Database-level security policies
- **Real-time Subscriptions**: Live updates for car data

## 🏗️ Project Structure

```
car-commerce/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   └── utils/         # Utility functions
│   └── public/
├── backend/               # Node.js/Express API
│   ├── config/            # Supabase configuration
│   │   ├── supabase.js    # Supabase client setup
│   │   └── schema.sql     # Database schema
│   ├── services/          # Supabase service layer
│   │   ├── authService.js
│   │   ├── carService.js
│   │   └── orderService.js
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication middleware
│   ├── scripts/
│   │   └── seed.js        # Database seeding
│   └── server.js          # Main server file
├── SUPABASE_SETUP.md      # Complete Supabase setup guide
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A free Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-commerce
   ```

2. **Set up Supabase** (see detailed guide below)
   ```bash
   # Follow SUPABASE_SETUP.md for complete instructions
   # This includes creating your project and setting up the database
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file with Supabase credentials
   npm run seed  # Populate database with sample data
   npm start
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Environment Variables**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 🔗 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/wishlist/:carId` - Toggle wishlist item
- `GET /api/auth/wishlist` - Get user wishlist

### 🚗 Cars
- `GET /api/cars` - Get all cars (with filtering, pagination, search)
- `GET /api/cars/:id` - Get single car with reviews
- `POST /api/cars` - Create car (admin only)
- `PUT /api/cars/:id` - Update car (admin only)
- `DELETE /api/cars/:id` - Delete car (admin only)
- `POST /api/cars/:id/reviews` - Add review to car
- `GET /api/cars/featured/all` - Get featured cars

### 📦 Orders
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (admin only)

## Technology Stack

### Frontend
- **React**: Component-based UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Heroicons**: Beautiful hand-crafted SVG icons

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Supabase**: PostgreSQL database with real-time capabilities
- **Supabase Auth**: Built-in authentication system
- **Row Level Security**: Database-level security policies
- **Real-time**: Live data synchronization
- **CORS**: Cross-origin resource sharing

## Features in Detail

### Car Listings
- Advanced filtering by category, brand, price range
- Search functionality across car names and descriptions
- Sorting by price, date, rating
- Pagination for large result sets

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Protected routes and API endpoints

### Shopping Cart
- Add/remove cars from cart
- Quantity management
- Persistent cart state
- Order total calculation

### Order Management
- Complete order lifecycle
- Order status tracking
- Order history
- Admin order management

## ⚙️ Supabase Setup

**Quick Setup:**
1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `backend/config/schema.sql` in your Supabase SQL Editor
3. Copy your project URL and anon key to `backend/.env`
4. Run `npm run seed` to populate with sample data

**Detailed instructions:** See `SUPABASE_SETUP.md` for the complete setup guide.

## 🚀 Ready to Launch!

Your car commerce platform now uses **Supabase** - a modern, scalable database with real-time capabilities! 🎉

**Key Benefits:**
- ✅ **Real-time updates** for live car data
- ✅ **Built-in authentication** (no JWT management needed)
- ✅ **Automatic API generation** with Supabase
- ✅ **PostgreSQL power** with advanced queries
- ✅ **Serverless scalability**
- ✅ **Row-level security** for data protection

## Development

### Available Scripts

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

**Backend:**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Code Quality
- ESLint configuration for code linting
- Prettier for code formatting
- Consistent code structure and naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.

# phoenix
