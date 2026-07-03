const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const Service = require('../models/Service');

// @desc    Toggle favorite status for an item
// @route   POST /api/favorites/toggle
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      res.status(400);
      throw new Error('Please provide itemId and itemType');
    }

    if (itemType !== 'Product' && itemType !== 'Service') {
      res.status(400);
      throw new Error('Invalid itemType. Must be Product or Service');
    }

    // Verify item exists
    if (itemType === 'Product') {
      const product = await Product.findById(itemId);
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
    } else {
      const service = await Service.findById(itemId);
      if (!service) {
        res.status(404);
        throw new Error('Service not found');
      }
    }

    // Check if favorite already exists
    const query = {
      user: req.user.id,
      itemType
    };
    
    if (itemType === 'Product') {
      query.product = itemId;
    } else {
      query.service = itemId;
    }

    const existingFav = await Favorite.findOne(query);

    if (existingFav) {
      // Remove it
      await existingFav.deleteOne();
      res.status(200).json({
        success: true,
        data: { isFavorite: false },
        message: 'Removed from favorites'
      });
    } else {
      // Add it
      const newFavData = {
        user: req.user.id,
        itemType
      };
      if (itemType === 'Product') newFavData.product = itemId;
      if (itemType === 'Service') newFavData.service = itemId;

      await Favorite.create(newFavData);
      res.status(200).json({
        success: true,
        data: { isFavorite: true },
        message: 'Added to favorites'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    const { itemType } = req.query; // optional filter
    
    const query = { user: req.user.id };
    if (itemType) {
      query.itemType = itemType;
    }

    const favorites = await Favorite.find(query)
      .populate({
        path: 'product',
        populate: { path: 'sellerId', select: 'name avatar ratingAvg' }
      })
      .populate({
        path: 'service',
        populate: { path: 'providerId', select: 'name avatar ratingAvg' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if an item is favorited by current user
// @route   GET /api/favorites/check/:itemType/:itemId
// @access  Private
const checkFavorite = async (req, res, next) => {
    try {
        const { itemType, itemId } = req.params;
        
        const query = {
            user: req.user.id,
            itemType
        };

        if (itemType === 'Product') {
            query.product = itemId;
        } else if (itemType === 'Service') {
            query.service = itemId;
        } else {
            res.status(400);
            throw new Error('Invalid itemType');
        }

        const fav = await Favorite.findOne(query);

        res.status(200).json({
            success: true,
            data: { isFavorite: !!fav }
        });
    } catch (error) {
        next(error);
    }
}


module.exports = {
  toggleFavorite,
  getMyFavorites,
  checkFavorite
};
