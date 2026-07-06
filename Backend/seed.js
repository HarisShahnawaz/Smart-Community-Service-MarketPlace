const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform administrator',
      location: { city: 'New York', country: 'USA' },
      skills: ['Management', 'Development']
    });

    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Web developer and designer',
        location: { city: 'San Francisco', country: 'USA' },
        skills: ['Web Development', 'UI/UX Design'],
        ratingAvg: 4.5,
        ratingCount: 10
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Graphic designer and illustrator',
        location: { city: 'Los Angeles', country: 'USA' },
        skills: ['Graphic Design', 'Illustration'],
        ratingAvg: 4.8,
        ratingCount: 15
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Freelance writer and editor',
        location: { city: 'Chicago', country: 'USA' },
        skills: ['Writing', 'Editing'],
        ratingAvg: 4.2,
        ratingCount: 8
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Photographer and videographer',
        location: { city: 'Miami', country: 'USA' },
        skills: ['Photography', 'Video Editing'],
        ratingAvg: 4.7,
        ratingCount: 12
      }
    ]);

    console.log('Created users');

    // Create products
    const products = await Product.create([
      {
        title: 'Vintage Camera Collection',
        description: 'Collection of vintage cameras from the 1960s and 1970s. All in working condition.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/camera.jpg'],
        price: 450,
        category: 'Electronics',
        condition: 'used',
        location: 'San Francisco, CA',
        sellerId: users[0]._id,
        status: 'active',
        ratingAvg: 4.5,
        ratingCount: 3
      },
      {
        title: 'Modern Office Desk',
        description: 'Sleek modern office desk with built-in cable management. Minimal wear.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/desk.jpg'],
        price: 200,
        category: 'Furniture',
        condition: 'used',
        location: 'Los Angeles, CA',
        sellerId: users[1]._id,
        status: 'active',
        ratingAvg: 4.0,
        ratingCount: 2
      },
      {
        title: 'Gaming Laptop',
        description: 'High-performance gaming laptop, 1 year old. Great condition.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/laptop.jpg'],
        price: 1200,
        category: 'Electronics',
        condition: 'used',
        location: 'Chicago, IL',
        sellerId: users[2]._id,
        status: 'active',
        ratingAvg: 5.0,
        ratingCount: 1
      },
      {
        title: 'Mountain Bike',
        description: 'Brand new mountain bike, never used. Still in box.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/bike.jpg'],
        price: 350,
        category: 'Sports',
        condition: 'new',
        location: 'Miami, FL',
        sellerId: users[3]._id,
        status: 'active'
      },
      {
        title: 'Art Supplies Bundle',
        description: 'Complete set of professional art supplies including paints, brushes, and canvas.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/art.jpg'],
        price: 150,
        category: 'Art',
        condition: 'new',
        location: 'San Francisco, CA',
        sellerId: users[0]._id,
        status: 'pending'
      }
    ]);

    console.log('Created products');

    // Create services
    const services = await Service.create([
      {
        title: 'Web Development',
        description: 'Custom website development using React, Node.js, and MongoDB. Full-stack solutions.',
        price: 500,
        deliveryTimeInDays: 7,
        category: 'Web Development',
        portfolioImages: ['https://res.cloudinary.com/demo/image/upload/v1580220268/web.jpg'],
        availability: true,
        providerId: users[0]._id,
        status: 'active',
        ratingAvg: 4.8,
        ratingCount: 5
      },
      {
        title: 'Logo Design',
        description: 'Professional logo design with multiple revisions and source files included.',
        price: 150,
        deliveryTimeInDays: 3,
        category: 'Graphic Design',
        portfolioImages: ['https://res.cloudinary.com/demo/image/upload/v1580220268/logo.jpg'],
        availability: true,
        providerId: users[1]._id,
        status: 'active',
        ratingAvg: 4.6,
        ratingCount: 8
      },
      {
        title: 'Content Writing',
        description: 'SEO-optimized blog posts and articles on any topic. 1000 words per order.',
        price: 50,
        deliveryTimeInDays: 2,
        category: 'Writing',
        portfolioImages: ['https://res.cloudinary.com/demo/image/upload/v1580220268/writing.jpg'],
        availability: true,
        providerId: users[2]._id,
        status: 'active',
        ratingAvg: 4.3,
        ratingCount: 4
      },
      {
        title: 'Product Photography',
        description: 'Professional product photography for e-commerce. 10 high-quality images.',
        price: 200,
        deliveryTimeInDays: 5,
        category: 'Photography',
        portfolioImages: ['https://res.cloudinary.com/demo/image/upload/v1580220268/photo.jpg'],
        availability: true,
        providerId: users[3]._id,
        status: 'active',
        ratingAvg: 4.9,
        ratingCount: 6
      },
      {
        title: 'Video Editing',
        description: 'Professional video editing for YouTube, social media, or corporate videos.',
        price: 300,
        deliveryTimeInDays: 4,
        category: 'Video Production',
        portfolioImages: ['https://res.cloudinary.com/demo/image/upload/v1580220268/video.jpg'],
        availability: true,
        providerId: users[3]._id,
        status: 'pending'
      }
    ]);

    console.log('Created services');

    // Create bookings
    const bookings = await Booking.create([
      {
        service: services[0]._id,
        client: users[1]._id,
        provider: users[0]._id,
        message: 'Need a portfolio website with e-commerce functionality',
        totalPrice: 500,
        status: 'completed'
      },
      {
        service: services[1]._id,
        client: users[2]._id,
        provider: users[1]._id,
        message: 'Need a logo for my startup',
        totalPrice: 150,
        status: 'accepted'
      },
      {
        service: services[2]._id,
        client: users[0]._id,
        provider: users[2]._id,
        message: 'Need 5 blog posts about technology',
        totalPrice: 250,
        status: 'pending'
      },
      {
        service: services[3]._id,
        client: users[0]._id,
        provider: users[3]._id,
        message: 'Need product photos for my online store',
        totalPrice: 200,
        status: 'completed'
      }
    ]);

    console.log('Created bookings');

    // Create reviews
    await Review.create([
      {
        reviewerId: users[1]._id,
        targetId: users[0]._id,
        targetType: 'User',
        rating: 5,
        comment: 'Excellent work! Very professional and delivered on time.',
        bookingId: bookings[0]._id
      },
      {
        reviewerId: users[2]._id,
        targetId: users[1]._id,
        targetType: 'User',
        rating: 4,
        comment: 'Great design work, but took a bit longer than expected.',
        bookingId: bookings[1]._id
      },
      {
        reviewerId: users[0]._id,
        targetId: users[2]._id,
        targetType: 'User',
        rating: 5,
        comment: 'Well-written content, exactly what I needed.',
        bookingId: bookings[2]._id
      },
      {
        reviewerId: users[0]._id,
        targetId: users[3]._id,
        targetType: 'User',
        rating: 5,
        comment: 'Amazing photos! Will definitely hire again.',
        bookingId: bookings[3]._id
      },
      {
        reviewerId: users[1]._id,
        targetId: services[0]._id,
        targetType: 'Service',
        rating: 5,
        comment: 'Best web development service I\'ve used!'
      },
      {
        reviewerId: users[2]._id,
        targetId: services[1]._id,
        targetType: 'Service',
        rating: 4,
        comment: 'Creative logo design, very satisfied.'
      },
      {
        reviewerId: users[0]._id,
        targetId: products[0]._id,
        targetType: 'Product',
        rating: 5,
        comment: 'Vintage cameras in perfect condition!'
      }
    ]);

    console.log('Created reviews');

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');
    console.log('User 3: bob@example.com / password123');
    console.log('User 4: alice@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
