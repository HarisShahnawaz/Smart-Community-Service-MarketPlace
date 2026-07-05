const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['User', 'Service', 'Product'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  bookingId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: false
  }
}, {
  timestamps: true
});

// Ensure one review per reviewer per target
reviewSchema.index({ reviewerId: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
