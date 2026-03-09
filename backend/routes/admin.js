const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const reservationService = require('../services/reservationService');

// Middleware to ensure all routes here are admin-only
router.use(authenticateToken);
router.use(requireAdmin);

// GET /stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { range = '30d' } = req.query; // '30d', '7d', '24h'

    // 1. Get counts
    const [
      { count: salesCount, error: salesError },
      { count: bookingsCount, error: bookingsError },
      { count: testDrivesCount, error: testDrivesError }
    ] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'delivered']),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    if (salesError) throw salesError;
    if (bookingsError) throw bookingsError;
    if (testDrivesError) throw testDrivesError;

    // 1b. Sum total stock across all cars
    const { data: allCars, error: carsError } = await supabase
      .from('cars')
      .select('stock');
    if (carsError) throw carsError;
    const totalStock = (allCars || []).reduce((sum, car) => sum + (car.stock || 0), 0);

    // 2. Calculate Total Revenue (All time)
    const { data: allSales, error: revenueError } = await supabase
      .from('reservations')
      .select('total_amount')
      .in('status', ['confirmed', 'delivered']);

    let totalSalesValue = 0;
    if (!revenueError && allSales) {
      totalSalesValue = allSales.reduce((sum, reservation) => sum + (reservation.total_amount || 0), 0);
    }

    // 3. Calculate Revenue Trend
    const now = new Date();
    let startDate = new Date();
    let groupBy = 'day'; // 'day' or 'hour'
    let labelsCount = 30;

    if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
      labelsCount = 7;
    } else if (range === '24h') {
      startDate.setHours(now.getHours() - 24);
      groupBy = 'hour';
      labelsCount = 24;
    } else {
      // Default 30d
      startDate.setDate(now.getDate() - 30);
    }

    const { data: trendReservations, error: trendError } = await supabase
      .from('reservations')
      .select('total_amount, created_at')
      .in('status', ['confirmed', 'delivered'])
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (trendError) throw trendError;

    // Build Map with ISO keys for stability
    const revenueMap = {};
    const displayMap = {}; // Map ISO key to display label

    // Initialize map
    for (let i = 0; i < labelsCount; i++) {
      const d = new Date();
      let key;
      let label;
      if (groupBy === 'hour') {
        d.setHours(d.getHours() - i);
        key = d.toLocaleString('en-US', { hour: 'numeric', day: 'numeric' }); // usage specific
      } else {
        d.setDate(d.getDate() - i);
        key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      if (groupBy === 'hour') {
        label = d.toLocaleString('en-US', { hour: 'numeric', hour12: true });
      } else {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      revenueMap[key] = 0;
      displayMap[key] = label;
    }

    if (trendReservations) {
      trendReservations.forEach(reservation => {
        const date = new Date(reservation.created_at);
        let key;
        if (groupBy === 'hour') {
          // Matching hour roughly
          key = date.toLocaleString('en-US', { hour: 'numeric', day: 'numeric' });
        } else {
          key = date.toISOString().split('T')[0];
        }

        if (revenueMap[key] !== undefined) {
          revenueMap[key] += (reservation.total_amount || 0);
        }
      });
    }

    // Rebuild array chronologically
    const revenueTrend = [];
    for (let i = labelsCount - 1; i >= 0; i--) {
      const d = new Date();
      let key;
      if (groupBy === 'hour') {
        d.setHours(d.getHours() - i);
        key = d.toLocaleString('en-US', { hour: 'numeric', day: 'numeric' });
      } else {
        d.setDate(d.getDate() - i);
        key = d.toISOString().split('T')[0];
      }

      revenueTrend.push({
        date: displayMap[key] || 'N/A',
        revenue: revenueMap[key] || 0
      });
    }

    // 4. Recent Bookings (last 5) — with car join + fallback
    let recentBookingsData = [];
    const { data: recentWithCars, error: recentError } = await supabase
      .from('reservations')
      .select('id, total_amount, status, created_at, cars ( id, name, brand, model )')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!recentError && recentWithCars) {
      recentBookingsData = recentWithCars;
    } else {
      // Fallback without car join
      const { data: recentFallback } = await supabase
        .from('reservations')
        .select('id, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      recentBookingsData = recentFallback || [];
    }

    res.json({
      totalSales: totalSalesValue,
      salesCount: salesCount || 0,
      activeBookings: bookingsCount || 0,
      carsInStock: totalStock,
      pendingTestDrives: testDrivesCount || 0,
      revenueTrend,
      recentBookings: recentBookingsData
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// GET /users - List all users (profiles) with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      users: data,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalUsers: count
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /users/:id - Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    // Fetch user's reservations summary
    const { count: reservationCount, error: reservationError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    if (reservationError) console.warn('Error fetching user reservation count:', reservationError);

    res.json({
      ...user,
      totalReservations: reservationCount || 0
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(404).json({ message: 'User not found' });
  }
});

// PUT /users/:id - Update user (role, block/unblock)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    // Construct update object with only provided fields
    const updates = {};
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// GET /bookings - List all bookings/reservations
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Use the service which correctly handles the schema
    const result = await reservationService.getAllReservations(pageInt, limitInt, status);

    // Default to returning just the array for backward compatibility
    res.json(result.reservations);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: `Failed to fetch bookings: ${error.message}` });
  }
});

// PUT /bookings/:id/status - Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'ready for pickup'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: `Failed to update booking status: ${error.message || error}` });
  }
});

module.exports = router;
