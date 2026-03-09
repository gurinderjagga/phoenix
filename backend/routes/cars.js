const express = require('express');
const carService = require('../services/carService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all cars with optional filtering
router.get('/', async (req, res) => {
  try {
    const result = await carService.getCars(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured cars — must be BEFORE /:id to avoid route conflict
router.get('/featured/all', async (req, res) => {
  try {
    const featuredCars = await carService.getFeaturedCars();
    res.json(featuredCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.json(car);
  } catch (error) {
    console.error('getCarById error for id:', req.params.id, error.message);
    res.status(404).json({ message: error.message });
  }
});

// Create new car (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update car (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    res.json(car);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete car (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await carService.deleteCar(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;