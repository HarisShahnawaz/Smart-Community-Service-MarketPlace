const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

// Helper to upload a single file buffer to Cloudinary
const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'smart-community/services' },
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

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res, next) => {
  try {
    const { title, description, price, deliveryTimeInDays, category, availability } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadStream(file.buffer));
      imageUrls = await Promise.all(uploadPromises);
    }

    const service = await Service.create({
      title,
      description,
      price,
      deliveryTimeInDays,
      category,
      availability: availability === 'true' || availability === true,
      portfolioImages: imageUrls,
      providerId: req.user.id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
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

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('providerId', 'name avatar ratingAvg')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Service.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId', 'name avatar contactNumber location ratingAvg ratingCount');
    
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (service.providerId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized to update this service');
    }

    let imageUrls = service.portfolioImages;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadStream(file.buffer));
      const newImages = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...newImages];
    }

    const updatedData = { ...req.body, portfolioImages: imageUrls };
    if (updatedData.availability !== undefined) {
      updatedData.availability = updatedData.availability === 'true' || updatedData.availability === true;
    }
    
    if (req.user.role !== 'admin' && updatedData.status) {
        delete updatedData.status; 
    }

    service = await Service.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (service.providerId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('User not authorized to delete this service');
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
};
