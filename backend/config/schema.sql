-- Car Commerce Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Users table (extends Supabase auth.users)
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

-- Cars table
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
  category TEXT NOT NULL CHECK (category IN ('SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van', 'Wagon', 'Sports Car')),
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(car_id, user_id) -- One review per user per car
);

-- Wishlist table
CREATE TABLE public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, car_id) -- One entry per user per car
);

-- Cart table
CREATE TABLE public.cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, car_id) -- One cart entry per user per car
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_cars_brand ON public.cars(brand);
CREATE INDEX idx_cars_category ON public.cars(category);
CREATE INDEX idx_cars_featured ON public.cars(featured);
CREATE INDEX idx_cars_price ON public.cars(price);
CREATE INDEX idx_cars_year ON public.cars(year);
CREATE INDEX idx_reviews_car_id ON public.reviews(car_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX idx_cart_user_id ON public.cart(user_id);
CREATE INDEX idx_cart_updated_at ON public.cart(updated_at);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Full-text search index for cars
CREATE INDEX idx_cars_search ON public.cars USING gin(to_tsvector('english', name || ' ' || brand || ' ' || model || ' ' || description));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate car rating from reviews
CREATE OR REPLACE FUNCTION calculate_car_rating(car_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2) INTO avg_rating
  FROM public.reviews
  WHERE car_id = car_uuid;

  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to update car rating when reviews change
CREATE OR REPLACE FUNCTION update_car_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.cars
  SET rating = calculate_car_rating(NEW.car_id)
  WHERE id = NEW.car_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update car ratings
CREATE TRIGGER update_car_rating_on_insert AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_car_rating();
CREATE TRIGGER update_car_rating_on_update AFTER UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_car_rating();
CREATE TRIGGER update_car_rating_on_delete AFTER DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_car_rating();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars policies (public read, admin write)
CREATE POLICY "Anyone can view cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Admins can insert cars" ON public.cars FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update cars" ON public.cars FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete cars" ON public.cars FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Cart policies
CREATE POLICY "Users can view their own cart" ON public.cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their own cart" ON public.cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own cart" ON public.cart FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);