const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.contactNumber = req.body.contactNumber !== undefined ? req.body.contactNumber : user.contactNumber;
      
      if (req.body.city || req.body.country) {
        user.location = {
          city: req.body.city || user.location.city,
          country: req.body.country || user.location.country
        };
      }

      if (req.body.skills) {
        // Can be a comma separated string or array
        user.skills = Array.isArray(req.body.skills) 
          ? req.body.skills 
          : req.body.skills.split(',').map(skill => skill.trim());
      }

      // Handle avatar upload to Cloudinary if file is attached
      if (req.file) {
        // Upload from buffer
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'smart-community/avatars' },
          async (error, result) => {
            if (error) {
              return next(new Error('Image upload failed'));
            }
            user.avatar = result.secure_url;
            
            const updatedUser = await user.save();
            return res.status(200).json({
              success: true,
              data: updatedUser,
            });
          }
        );
        
        // Write buffer to stream
        uploadStream.end(req.file.buffer);
      } else {
        const updatedUser = await user.save();
        res.status(200).json({
          success: true,
          data: updatedUser,
        });
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (Public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -isSuspended -resetPasswordToken -resetPasswordExpires');
    
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
};
