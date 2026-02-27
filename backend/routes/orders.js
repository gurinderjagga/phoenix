const express = require('express');
const orderService = require('../services/orderService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const result = await orderService.getUserOrders(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const order = await orderService.getOrderById(req.params.id, req.user.id, isAdmin);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Book a car directly (creates order with single item)
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { carId, quantity = 1, shippingAddress, paymentMethod, orderNotes } = req.body;

    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    const result = await orderService.bookCar(req.user.id, {
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

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(req.params.id, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order (user can cancel if pending, admin can cancel any)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const result = await orderService.cancelOrder(req.params.id, req.user.id, isAdmin);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const result = await orderService.getAllOrders(page, limit, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;