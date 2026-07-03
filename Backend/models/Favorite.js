const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['Product', 'Service'],
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service'
  }
}, {
  timestamps: true
});

// Ensure a user can only favorite an item once
favoriteSchema.index({ user: 1, product: 1, service: 1 }, { unique: true });

// Validation to ensure either product or service is provided based on itemType
favoriteSchema.pre('validate', function(next) {
  if (this.itemType === 'Product' && !this.product) {
    next(new Error('Product ID is required when itemType is Product'));
  } else if (this.itemType === 'Service' && !this.service) {
    next(new Error('Service ID is required when itemType is Service'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
