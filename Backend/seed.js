const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Favorite = require('./models/Favorite');

dotenv.config();

// ─── SAFETY GUARD ────────────────────────────────────────────────────────────
// This script wipes ALL collections before inserting seed data.
// It MUST NOT run automatically or accidentally.
// To run intentionally:  ALLOW_SEED_WIPE=true node seed.js
const FORCE_SEED = process.env.ALLOW_SEED_WIPE === 'true';
if (!FORCE_SEED) {
  console.error('\n🚫 SEEDING BLOCKED');
  console.error('   This script deletes ALL data in every collection.');
  console.error('   To run it intentionally, set the env variable:');
  console.error('     ALLOW_SEED_WIPE=true node seed.js');
  console.error('   Never set this variable in .env or in any automated process.\n');
  process.exit(1);
}
// ─────────────────────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // ⚠️  DESTRUCTIVE BLOCK — wipes every collection ⚠️
    console.log('\n⚠️  WARNING: Wiping all collections — this is intentional (ALLOW_SEED_WIPE=true was set).');
    await User.deleteMany({});         console.log('   Wiped: Users');
    await Product.deleteMany({});      console.log('   Wiped: Products');
    await Service.deleteMany({});      console.log('   Wiped: Services');
    await Booking.deleteMany({});      console.log('   Wiped: Bookings');
    await Review.deleteMany({});       console.log('   Wiped: Reviews');
    await Order.deleteMany({});        console.log('   Wiped: Orders');
    await Conversation.deleteMany({}); console.log('   Wiped: Conversations');
    await Message.deleteMany({});      console.log('   Wiped: Messages');
    await Notification.deleteMany({}); console.log('   Wiped: Notifications');
    await Favorite.deleteMany({});     console.log('   Wiped: Favorites');
    console.log('✅ Cleared existing data\n');

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
        bio: 'Full-stack web developer with 6+ years of experience building scalable applications using React, Node.js, and cloud technologies. I specialize in e-commerce platforms and real-time collaboration tools. Previously worked at two tech startups and have delivered 50+ client projects with a focus on clean code and user experience.',
        location: { city: 'San Francisco', country: 'USA' },
        skills: ['Web Development', 'UI/UX Design', 'React', 'Node.js', 'MongoDB', 'AWS'],
        ratingAvg: 4.5,
        ratingCount: 10
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Creative graphic designer and brand strategist with 8 years of experience helping startups and small businesses establish their visual identity. I specialize in logo design, brand guidelines, and marketing collateral. My work has been featured in several design publications and I\'ve worked with clients across tech, hospitality, and retail sectors.',
        location: { city: 'Los Angeles', country: 'USA' },
        skills: ['Graphic Design', 'Illustration', 'Branding', 'Adobe Creative Suite', 'Figma', 'Typography'],
        ratingAvg: 4.8,
        ratingCount: 15
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Professional freelance writer and editor with a background in journalism and content marketing. I craft compelling blog posts, white papers, and technical documentation that engage readers and drive conversions. My expertise spans technology, finance, and healthcare industries, with a focus on SEO-optimized content that performs.',
        location: { city: 'Chicago', country: 'USA' },
        skills: ['Writing', 'Editing', 'SEO', 'Content Strategy', 'Technical Writing', 'Copywriting'],
        ratingAvg: 4.2,
        ratingCount: 8
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Professional photographer and videographer with 10+ years of experience capturing moments for weddings, corporate events, and product launches. I specialize in portrait photography, product photography for e-commerce, and cinematic video production. My equipment includes professional-grade Sony cameras and drone technology for aerial shots.',
        location: { city: 'Miami', country: 'USA' },
        skills: ['Photography', 'Video Editing', 'Adobe Premiere', 'Lightroom', 'Drone Photography', 'Portrait Photography'],
        ratingAvg: 4.7,
        ratingCount: 12
      }
    ]);

    console.log('Created users');

    // Create products
    const products = await Product.create([
      {
        title: 'Vintage Canon AE-1 Camera Collection',
        description: 'Complete vintage camera collection featuring a Canon AE-1 body in excellent working condition, along with three FD-mount lenses (50mm f/1.8, 35mm f/2.8, and 135mm f/2.8). All cameras and lenses have been professionally cleaned and tested. The AE-1 includes its original leather case and user manual. Perfect for film photography enthusiasts or collectors. Shutter speeds are accurate, light meter works perfectly, and there are no scratches on the glass elements.',
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
        title: 'Modern Oak Office Desk with Cable Management',
        description: 'Sleek solid oak office desk measuring 60" x 30" with a natural finish. Features built-in cable management system with hidden compartments and grommet holes. Minimal wear from light use - a few minor scratches on the surface that are barely noticeable. Includes keyboard tray that can be mounted on either side. Sturdy construction with metal legs, weight capacity of 200 lbs. Perfect for home office or small business setup. Originally purchased from West Elm 2 years ago.',
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
        title: 'ASUS ROG Strix G15 Gaming Laptop',
        description: 'High-performance gaming laptop in excellent condition, only 1 year old. Specifications: AMD Ryzen 7 5800H processor, NVIDIA RTX 3060 6GB GPU, 16GB DDR4 RAM, 512GB NVMe SSD, 15.6" 144Hz IPS display. Includes original charger and ROG laptop backpack. Battery health is at 95% capacity. Never used for mining or heavy overclocking. Clean install of Windows 11 ready for new owner. Perfect for gaming, video editing, or software development.',
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
        title: 'Trek Marlin 7 Mountain Bike',
        description: 'Brand new Trek Marlin 7 mountain bike, still in original box. Never ridden or assembled. Size large (18" frame) fits riders 5\'11" to 6\'3". Features: 2x9 Shimano Deore drivetrain, hydraulic disc brakes, 29" wheels with tubeless-ready tires, and a suspension fork with 100mm travel. Perfect for trails and cross-country riding. Includes all original accessories and documentation. Retails for $850+, selling at a significant discount.',
        images: ['https://res.cloudinary.com/demo/image/upload/v1580220268/bike.jpg'],
        price: 350,
        category: 'Sports',
        condition: 'new',
        location: 'Miami, FL',
        sellerId: users[3]._id,
        status: 'active'
      },
      {
        title: 'Professional Art Supplies Bundle',
        description: 'Complete professional art supplies collection including: 24-piece Winsor & Newton oil paint set, variety of brushes (round, flat, filbert sizes 2-12), stretched canvas panels (8x10, 11x14, 16x20), wooden easel, palette knives, and sketchbook. All supplies are new or barely used. Perfect for aspiring artists or students. The oil paints are professional grade with excellent pigment quality. Total value over $300 if purchased separately.',
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
        title: 'Full-Stack Web Development - Custom Applications',
        description: 'I build custom web applications from scratch using modern technologies. This service includes: initial consultation and requirements gathering, full-stack development with React frontend and Node.js backend, database design and implementation, responsive design for all devices, basic SEO optimization, and deployment to your preferred hosting platform. What\'s included: source code, 2 rounds of revisions, 30 days of post-launch support. Not included: ongoing maintenance, third-party service costs (hosting, domains), content creation. Typical process: discovery call (1 day), design mockups (2-3 days), development (5-7 days), testing and deployment (1-2 days).',
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
        title: 'Professional Logo Design & Brand Identity Package',
        description: 'Complete logo design service that establishes your brand\'s visual identity. Includes: 3-5 initial logo concepts, unlimited revisions on chosen concept, final logo files in all formats (PNG, JPG, SVG, EPS, PDF), brand color palette, typography recommendations, and a simple brand guidelines document. What\'s included: commercial usage rights, all source files, social media profile versions. Not included: website design, print design, additional brand assets. Process: brief questionnaire (1 day), concept development (2 days), revisions (2-3 days), final delivery (1 day).',
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
        title: 'SEO-Optimized Blog Posts & Articles',
        description: 'High-quality, SEO-optimized content that engages readers and ranks well in search engines. Each 1000-word article includes: keyword research and optimization, engaging headline options, well-structured content with subheadings, internal linking suggestions, and meta descriptions. What\'s included: original content (Copyscape passed), 1 revision round, keyword research, SEO recommendations. Not included: images, publishing to your CMS, ongoing content strategy. Process: topic approval (same day), research and outline (1 day), writing (1 day), revisions and delivery (1 day).',
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
        title: 'Professional Product Photography for E-Commerce',
        description: 'High-quality product photography that showcases your products in the best light. Package includes: 10 professionally edited product shots on white background, 3 lifestyle/context shots, basic retouching (color correction, dust removal), and web-ready images optimized for fast loading. What\'s included: all high-resolution images, web-ready versions, commercial usage rights. Not included: product shipping (local pickup preferred), complex props or models, extensive photo manipulation. Process: product consultation (1 day), photography session (1 day), editing and delivery (2-3 days).',
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
        title: 'Professional Video Editing for Content Creators',
        description: 'Professional video editing services for YouTube, social media, or corporate videos. Service includes: cutting and assembling footage, color grading, audio mixing and enhancement, adding titles and graphics, background music selection, and optimization for your platform. What\'s included: 1 revision round, multiple format exports, motion graphics templates. Not included: original footage creation, voiceover recording, complex 3D animation. Process: footage review (1 day), first cut (2-3 days), revisions (1-2 days), final delivery (1 day).',
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
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        totalPrice: 500,
        status: 'completed'
      },
      {
        service: services[1]._id,
        client: users[2]._id,
        provider: users[1]._id,
        message: 'Need a logo for my startup',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalPrice: 150,
        status: 'accepted'
      },
      {
        service: services[2]._id,
        client: users[0]._id,
        provider: users[2]._id,
        message: 'Need 5 blog posts about technology',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalPrice: 250,
        status: 'pending'
      },
      {
        service: services[3]._id,
        client: users[0]._id,
        provider: users[3]._id,
        message: 'Need product photos for my online store',
        scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
        comment: 'John built an incredible portfolio website for my design business. He was incredibly responsive throughout the process, asked all the right questions about my requirements, and delivered exactly what I envisioned. The code is clean and well-documented, making it easy for me to make small updates myself. Highly recommend for any web development work!',
        bookingId: bookings[0]._id
      },
      {
        reviewerId: users[2]._id,
        targetId: users[1]._id,
        targetType: 'User',
        rating: 4,
        comment: 'Jane created a beautiful logo for my startup that perfectly captures our brand identity. She provided several initial concepts and was patient with my feedback during revisions. The only reason for 4 stars instead of 5 is that the final delivery took about 2 days longer than initially quoted, but the quality was worth the wait.',
        bookingId: bookings[1]._id
      },
      {
        reviewerId: users[0]._id,
        targetId: users[2]._id,
        targetType: 'User',
        rating: 5,
        comment: 'Bob wrote five excellent blog posts for my tech blog. His research was thorough, the writing was engaging and well-structured, and he nailed the technical tone I was looking for. The SEO optimization he included helped my articles rank much higher than my previous content. Will definitely work with him again.',
        bookingId: bookings[2]._id
      },
      {
        reviewerId: users[0]._id,
        targetId: users[3]._id,
        targetType: 'User',
        rating: 5,
        comment: 'Alice photographed 20 products for my online store and the results were stunning. She has an amazing eye for lighting and composition - every product looks professional and appealing. The editing was subtle but effective, enhancing the products without making them look artificial. My conversion rate increased by 15% after updating product photos!',
        bookingId: bookings[3]._id
      },
      {
        reviewerId: users[1]._id,
        targetId: services[0]._id,
        targetType: 'Service',
        rating: 5,
        comment: 'This web development service exceeded my expectations. John not only built a functional application but also provided valuable suggestions for improving the user experience. The code is scalable and well-organized, which has made future additions much easier. Best developer I\'ve worked with on this platform!'
      },
      {
        reviewerId: users[2]._id,
        targetId: services[1]._id,
        targetType: 'Service',
        rating: 4,
        comment: 'Jane\'s logo design service is top-notch. She really took the time to understand my brand and target audience before starting the design process. The final logo is modern, memorable, and versatile across different applications. Great value for the quality delivered.'
      },
      {
        reviewerId: users[0]._id,
        targetId: products[0]._id,
        targetType: 'Product',
        rating: 5,
        comment: 'The vintage Canon camera collection was exactly as described - all in excellent working condition with clean glass and accurate shutter speeds. John even included some helpful tips for getting started with film photography. Fast shipping and careful packaging. A fantastic find for any photography enthusiast!'
      }
    ]);

    console.log('Created reviews');

    // Create orders
    const orders = await Order.create([
      {
        productId: products[0]._id,
        buyerId: users[2]._id,
        sellerId: users[0]._id,
        quantity: 1,
        totalPrice: 450,
        shippingAddress: {
          fullName: 'Bob Johnson',
          phone: '123-456-7890',
          addressLine: '789 Pine Rd',
          city: 'Chicago',
          postalCode: '60601'
        },
        paymentMethod: 'demo_card',
        status: 'delivered'
      },
      {
        productId: products[1]._id,
        buyerId: users[0]._id,
        sellerId: users[1]._id,
        quantity: 1,
        totalPrice: 200,
        shippingAddress: {
          fullName: 'John Doe',
          phone: '987-654-3210',
          addressLine: '123 Main St',
          city: 'San Francisco',
          postalCode: '94101'
        },
        paymentMethod: 'cash_on_delivery',
        status: 'confirmed'
      }
    ]);

    // Update product status to sold for ordered products
    products[0].status = 'sold';
    products[1].status = 'sold';
    await products[0].save();
    await products[1].save();
    console.log('Created orders and updated product statuses to sold');

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
//test