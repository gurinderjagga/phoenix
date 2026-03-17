# 🚗 Phoenix

A modern, full-stack e-commerce application for buying and selling cars, built with React, Node.js, and **Supabase**.

## ✨ Features

### 🎨 Frontend (React + Tailwind CSS)
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Car Listings**: Browse cars with advanced filtering and search
- **Car Details**: Detailed car pages with specifications and reviews
- **Shopping Cart**: Add cars to cart and manage quantities
- **User Authentication**: Seamless login and registration via Supabase
- **User Profile**: Manage personal information and view order history
- **Order Management**: View and track orders/reservations
- **Real-time Updates**: Live data synchronization

### ⚡ Backend (Node.js + Express + Supabase)
- **RESTful API**: Complete API for cars, users, cart, reservations, and admin dashboard
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **User Management**: Registration, login, profile management
- **Car Management**: Full CRUD operations for car listings
- **Order Processing**: Complete reservation lifecycle management
- **Authentication**: Supabase Auth with role-based access
- **Row Level Security**: Database-level security policies

## 🏗️ Project Structure

```text
car-commerce/
├── frontend/              # React application
│   ├── public/            # Static assets
│   └── src/               # React source files
│       ├── components/    # Reusable UI components (admin, auth, UI elements)
│       ├── context/       # React context for state management (AuthContext, etc.)
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Page components (Home, Cars, Register, Login, Cart, Profile, etc.)
│       └── utils/         # API Service and Supabase client configs
├── backend/               # Node.js/Express API
│   ├── config/            # Configuration (supabase.js)
│   ├── middleware/        # Authentication & Role-based middleware (auth.js)
│   ├── models/            # Database definitions or local data structures
│   ├── routes/            # Express route handlers
│   │   ├── admin.js       # Admin panel routes
│   │   ├── auth.js        # Auth and profile routes
│   │   ├── cars.js        # Car listing and CRUD routes
│   │   ├── cart.js        # Shopping cart routes
│   │   └── reservations.js# Car booking and reservation routes
│   ├── scripts/           # Utility scripts (seed.js)
│   ├── services/          # Supabase service layer encapsulating DB logic
│   ├── uploads/           # Directory for uploaded assets/images
│   └── server.js          # Express app entry point
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

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file with Supabase credentials
   npm run seed  # Populate database with sample data
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 🔗 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `GET /api/auth/info` - Get auth configuration info
- `POST /api/auth/register` - User registration (delegated to Supabase)
- `POST /api/auth/login` - User login (delegated to Supabase)
- `POST /api/auth/callback` - Callback for Supabase to sync user profiles
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update current user profile
- `POST /api/auth/create-profile` - Create a user profile based on a valid token
- `PUT /api/auth/change-password` - Change user password
- `POST /api/auth/wishlist/:carId` - Add/remove car from wishlist
- `GET /api/auth/wishlist` - Get current user's wishlist

### 🚗 Cars (`/api/cars`)
- `GET /api/cars` - Get all cars (with search, category, and limit query params)
- `GET /api/cars/featured/all` - Get featured cars
- `GET /api/cars/:id` - Get a single car by its ID
- `POST /api/cars` - Create a new car listing (Admin only)
- `PUT /api/cars/:id` - Update an existing car listing (Admin only)
- `DELETE /api/cars/:id` - Delete a car listing (Admin only)

### 🛒 Shopping Cart (`/api/cart`) *(Requires Auth)*
- `GET /api/cart` - Get user's active cart and nested items
- `GET /api/cart/summary` - Get summary (item count, total price) of user's cart
- `POST /api/cart/add/:carId` - Add a specific car to the cart
- `PUT /api/cart/item/:cartItemId` - Update the quantity of a specific cart item
- `DELETE /api/cart/item/:cartItemId` - Remove an item from the cart
- `DELETE /api/cart/clear` - Clear all items from the user's cart

### 📅 Reservations / Bookings (`/api/reserved`) *(Requires Auth)*
- `GET /api/reserved/my-reservations` - Get all reservations for the logged-in user
- `GET /api/reserved/:id` - Get details of a single reservation
- `POST /api/reserved/book` - Book a car directly (create a reservation)
- `PUT /api/reserved/:id/status` - Update reservation status (Admin only)
- `PUT /api/reserved/:id/cancel` - Cancel a pending reservation (Admin or listing owner)
- `GET /api/reserved` - Get a paginated list of all reservations (Admin only)

### ⚙️ Admin Dashboard (`/api/admin`) *(Requires Admin Role)*
- `GET /api/admin/stats` - Get summary statistics (Total Sales, Revenue Trend, Cars in Stock, etc.)
- `GET /api/admin/users` - List all user profiles with search and pagination
- `GET /api/admin/users/:id` - Get a specific user profile and reservation counts
- `PUT /api/admin/users/:id` - Update a specific user's role or block status
- `GET /api/admin/bookings` - List all platform bookings/reservations with status filters
- `PUT /api/admin/bookings/:id/status` - Update the status of a specific booking

## Technology Stack

### Frontend
- **React**: Component-based UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase JS**: Browser client for Auth & DB interaction

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Supabase JS**: Server queries
- **CORS**: Cross-origin resource sharing

## License
This project is licensed under the MIT License.

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
- Complete reservation lifecycle
- Reservation status tracking
- Reservation history
- Admin reservation management

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

## Support

For questions or support, please contact the development team or create an issue in the repository.
