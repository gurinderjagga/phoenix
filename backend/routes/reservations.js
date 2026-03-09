const express = require('express');
const reservationService = require('../services/reservationService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's reservations
router.get('/my-reservations', authenticateToken, async (req, res) => {
  try {
    const result = await reservationService.getUserReservations(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single reservation by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const reservation = await reservationService.getReservationById(req.params.id, req.user.id, isAdmin);
    res.json(reservation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Book a car directly
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { carId, quantity = 1, shippingAddress, paymentMethod, orderNotes } = req.body;

    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    const result = await reservationService.bookCar(req.user.id, {
      carId,
      quantity,
      shippingAddress,
      paymentMethod,
      orderNotes
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update reservation status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await reservationService.updateReservationStatus(req.params.id, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel reservation (user can cancel if pending, admin can cancel any)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const result = await reservationService.cancelReservation(req.params.id, req.user.id, isAdmin);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reservations (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const result = await reservationService.getAllReservations(page, limit, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;