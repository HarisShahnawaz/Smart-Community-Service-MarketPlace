const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: {
    type: [String],
    validate: [v => v.length <= 5, 'You can upload up to 5 images max']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  condition: {
    type: String,
    required: [true, 'Please specify condition'],
    enum: ['new', 'used']
  },
  location: {
    type: String,
    required: [true, 'Please specify a location']
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'sold'],
    default: 'pending' // Admin approval required by default
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
