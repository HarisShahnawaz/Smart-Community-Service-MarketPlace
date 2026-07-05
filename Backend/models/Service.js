const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a starting price']
  },
  deliveryTimeInDays: {
    type: Number,
    required: [true, 'Please specify estimated delivery time in days']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  portfolioImages: {
    type: [String],
    validate: [v => v.length <= 5, 'You can upload up to 5 portfolio images max']
  },
  availability: {
    type: Boolean,
    default: true
  },
  providerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending'
  },
  ratingAvg: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
