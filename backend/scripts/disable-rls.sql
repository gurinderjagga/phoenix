-- Temporarily disable RLS for seeding
-- Run this in Supabase SQL Editor BEFORE running npm run seed

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
