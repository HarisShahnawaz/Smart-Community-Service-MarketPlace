const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Helper to upload a single file buffer to Cloudinary
const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'smart-community/products' },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, condition, location } = req.body;
    let imageUrls = [];

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadStream(file.buffer));
      imageUrls = await Promise.all(uploadPromises);
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      location,
      images: imageUrls,
      sellerId: req.user.id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    let query = { status: 'active' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'name avatar ratingAvg')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name avatar contactNumber location ratingAvg ratingCount');
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Make sure user is product owner
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized to update this product');
    }

    let imageUrls = product.images;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadStream(file.buffer));
      const newImages = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...newImages];
    }

    const updatedData = { ...req.body, images: imageUrls };
    // Prevent user from approving their own product (only admin can change status from pending to active)
    if (req.user.role !== 'admin' && updatedData.status) {
        delete updatedData.status; 
    }

    product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Make sure user is product owner
    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized to delete this product');
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
