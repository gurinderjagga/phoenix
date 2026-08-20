# 🧠 Phoenix Project Brain (Analysis File)

## Project Overview
**Phoenix** is a modern, full-stack e-commerce application designed for buying and selling cars.

### Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Supabase JS
- **Backend**: Node.js, Express.js, Supabase JS, CORS
- **Database**: Supabase (PostgreSQL with Real-time capabilities)
- **Authentication**: JWT-based, powered by Supabase Auth with Row Level Security (RLS)

## Directory Structure Analysis
- `/frontend/` - React application handling UI, routing, and client-side logic.
  - Components include admin, auth, and UI elements.
  - State management heavily relies on React Context (e.g., AuthContext).
- `/backend/` - Node.js/Express API.
  - Contains routes (`/api/auth`, `/api/cars`, `/api/reserved`, `/api/admin`).
  - Implements middleware for authentication and role-based access.
  - Uses Supabase service layer for DB logic.
- `/report/` - Documentation or generated reports for the project.
- `DATABASE_SETUP.md` & `SUPABASE_SETUP.md` - Key database setup and schema configurations.

## Core Features
1. **Car Listings**: Advanced filtering, search, pagination, and detailed car specs.
2. **User Authentication & Profiles**: Secure login/registration (via Supabase), profile management, role-based access control (Admin vs. User).
3. **Order & Reservation Management**: Complete lifecycle tracking for car bookings.
4. **Admin Dashboard**: Analytics, user management, and global booking overview.

## Quick Start Commands
- **Frontend**: `cd frontend && npm start`
- **Backend**: `cd backend && npm run dev`

## Notes for Future Analysis
- Backend operations delegate significant responsibilities (like auth and real-time data sync) directly to Supabase.
- When working on API routes, verify Row Level Security (RLS) policies set up on Supabase, as it will affect data access.
- Need to keep `.env` configuration aligned with Supabase credentials for both ends to function properly.
