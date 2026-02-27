const express = require('express');
const cartService = require('../services/cartService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const cart = await cartService.getUserCart(req.user.id);
    res.json(cart);
  } catch (error) {
    console.error('Cart route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get cart summary
router.get('/summary', async (req, res) => {
  try {
    const summary = await cartService.getCartSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    console.error('Cart summary route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add/:carId', async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const result = await cartService.addToCart(req.user.id, req.params.carId, quantity);
    res.json(result);
  } catch (error) {
    console.error('Add to cart route error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/item/:cartItemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const result = await cartService.updateCartItem(req.user.id, req.params.cartItemId, quantity);
    res.json(result);
  } catch (error) {
    console.error('Update cart item route error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/item/:cartItemId', async (req, res) => {
  try {
    const result = await cartService.removeFromCart(req.user.id, req.params.cartItemId);
    res.json(result);
  } catch (error) {
    console.error('Remove from cart route error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    const result = await cartService.clearCart(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Clear cart route error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;