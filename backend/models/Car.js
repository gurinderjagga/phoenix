const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  specifications: {
    engine: String,
    horsepower: Number,
    transmission: String,
    fuelType: String,
    mileage: Number,
    color: String,
    seats: Number
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  category: {
    type: String,
    enum: ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van'],
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for search functionality
carSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Car', carSchema);