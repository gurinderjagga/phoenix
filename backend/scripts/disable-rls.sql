-- Temporarily disable RLS for seeding
-- Run this in Supabase SQL Editor BEFORE running npm run seed

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;