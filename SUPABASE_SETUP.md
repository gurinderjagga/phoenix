# 🚀 Supabase Setup Guide for Car Commerce

## 📋 Prerequisites
- Node.js installed
- A free Supabase account ([supabase.com](https://supabase.com))

## 🔥 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `car-commerce` (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
4. Click **"Create new project"**
5. Wait for project initialization (usually 2-3 minutes)

## 🗄️ Step 2: Set up Database Schema

### Option A: Run SQL Script (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `backend/config/schema.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** to execute the schema

### Option B: Manual Table Creation

If you prefer to create tables manually:

#### 1. Create `profiles` table:
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  address JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### 2. Create `cars` table:
```sql
CREATE TABLE public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### 3. Create remaining tables:
Follow the same pattern for `reviews`, `wishlist`, `orders`, and `order_items` tables as defined in `schema.sql`.

## 🔑 Step 3: Configure Authentication

### Enable Email Authentication
1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates if desired

### Set up Row Level Security (RLS)
1. Go to **SQL Editor**
2. Run the RLS policies from `schema.sql`:
```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
-- ... (copy all RLS policies from schema.sql)
```

## 🌐 Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy your **Project URL**, **anon public** key, and **service_role** secret key
3. You'll need these for your environment variables

## ⚙️ Step 5: Configure Environment Variables

Create/update your `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Replace with your actual values from Step 4
# The service_role key is used for seeding and admin operations
```

## 🌱 Step 6: Seed Sample Data

```bash
cd backend
npm run seed
```

This will create:
- ✅ 6 sample cars with specifications
- ✅ User profiles (you'll need to create auth users separately)
- ✅ Sample reviews and wishlist items

## 🧪 Step 7: Test the Setup

### Start the Backend Server
```bash
npm start
```

### Test API Endpoints
```bash
# Get all cars
GET http://localhost:5000/api/cars

# Should return the seeded cars
```

## 👤 Step 8: Create Test Users (Optional)

Since Supabase Auth manages users, you can create test users through:

### Option A: Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create users with emails like `admin@carcommerce.com`

### Option B: Through Your App
Use the registration endpoint:
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@carcommerce.com",
  "password": "admin123"
}
```

## 🔐 Step 9: Update RLS Policies (Important!)

If you created users manually, update the profile records to match:

```sql
-- Update admin user
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@carcommerce.com';
```

## 🚀 Step 10: Connect Frontend

Your React frontend should work with minimal changes. The API endpoints remain the same!

## 🐛 Troubleshooting

### Common Issues:

#### 1. **"relation 'public.cars' does not exist"**
- Make sure you ran the SQL schema script
- Check table names are correct

#### 2. **Authentication Errors**
- Verify your Supabase URL and anon key
- Check RLS policies are enabled
- Ensure users exist in both `auth.users` and `profiles`

#### 3. **Seeding Errors**
- Make sure tables exist before running seed
- Check foreign key relationships

#### 4. **CORS Issues**
- Supabase handles CORS automatically
- If issues persist, check your Supabase project settings

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Functions](https://supabase.com/docs/guides/database/functions)

## 🎯 What's Different from MongoDB

### Advantages of Supabase:
- ✅ **Real-time subscriptions** (cars update live)
- ✅ **Built-in authentication** (no JWT management)
- ✅ **Automatic API generation** (REST & GraphQL)
- ✅ **Serverless** (no database management)
- ✅ **Better security** (RLS policies)
- ✅ **PostgreSQL power** (advanced queries, functions)

### Migration Changes:
- **Models** → **Services** (Supabase queries)
- **JWT tokens** → **Supabase auth sessions**
- **Mongoose queries** → **Supabase client queries**
- **Manual relationships** → **Foreign key constraints**

## 🚀 Ready to Launch!

Your Car Commerce app now uses Supabase - a modern, scalable database solution! 🎉

**Next Steps:**
1. Test all API endpoints
2. Connect your React frontend
3. Deploy to production
4. Enjoy real-time features!