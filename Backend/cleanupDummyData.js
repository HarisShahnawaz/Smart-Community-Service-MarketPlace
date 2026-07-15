/**
 * cleanupDummyData.js
 * One-time script to remove all seed/dummy data from the database.
 *
 * Strategy:
 *   - Identify seed users by their known @example.com emails
 *   - Delete every document in every collection that is owned-by / linked-to those seed users
 *   - Preserve all other accounts and their data (real users like Huzaifa)
 *
 * Run once with:  node cleanupDummyData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User         = require('./models/User');
const Product      = require('./models/Product');
const Service      = require('./models/Service');
const Booking      = require('./models/Booking');
const Review       = require('./models/Review');
const Order        = require('./models/Order');
const Conversation = require('./models/Conversation');
const Message      = require('./models/Message');
const Notification = require('./models/Notification');
const Favorite     = require('./models/Favorite');

// ─── Known seed user e-mails (from seed.js) ──────────────────────────────────
const SEED_EMAILS = [
  'admin@example.com',
  'john@example.com',
  'jane@example.com',
  'bob@example.com',
  'alice@example.com',
];

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ Connected to MongoDB');
    console.log('─────────────────────────────────────────');

    // 1. Find seed user IDs
    const seedUsers = await User.find({ email: { $in: SEED_EMAILS } }, '_id email');
    if (seedUsers.length === 0) {
      console.log('ℹ️  No seed users found. Database may already be clean.');
      await mongoose.disconnect();
      return;
    }

    const seedUserIds = seedUsers.map(u => u._id);
    console.log(`\n🔍 Found ${seedUsers.length} seed user(s) to remove:`);
    seedUsers.forEach(u => console.log(`   • ${u.email} (${u._id})`));

    // 2. Delete Reviews linked to seed users (as author or subject)
    const reviewsDel = await Review.deleteMany({
      $or: [
        { reviewer: { $in: seedUserIds } },
        { reviewee: { $in: seedUserIds } }
      ]
    });
    console.log(`\n🗑️  Reviews deleted      : ${reviewsDel.deletedCount}`);

    // 3. Delete Bookings involving seed users (as client or provider)
    const bookingsDel = await Booking.deleteMany({
      $or: [
        { client:   { $in: seedUserIds } },
        { provider: { $in: seedUserIds } }
      ]
    });
    console.log(`🗑️  Bookings deleted     : ${bookingsDel.deletedCount}`);

    // 4. Delete Orders belonging to seed users
    const ordersDel = await Order.deleteMany({
      $or: [
        { buyer:  { $in: seedUserIds } },
        { seller: { $in: seedUserIds } }
      ]
    });
    console.log(`🗑️  Orders deleted       : ${ordersDel.deletedCount}`);

    // 5. Delete Favorites belonging to seed users
    const favsDel = await Favorite.deleteMany({ user: { $in: seedUserIds } });
    console.log(`🗑️  Favorites deleted    : ${favsDel.deletedCount}`);

    // 6. Delete Notifications belonging to seed users
    const notifDel = await Notification.deleteMany({
      $or: [
        { recipient: { $in: seedUserIds } },
        { sender:    { $in: seedUserIds } }
      ]
    });
    console.log(`🗑️  Notifications deleted: ${notifDel.deletedCount}`);

    // 7. Delete Conversations & their Messages where any participant is a seed user
    const seedConvs = await Conversation.find(
      { participants: { $in: seedUserIds } },
      '_id'
    );
    const seedConvIds = seedConvs.map(c => c._id);
    const msgDel = await Message.deleteMany({ conversation: { $in: seedConvIds } });
    const convDel = await Conversation.deleteMany({ _id: { $in: seedConvIds } });
    console.log(`🗑️  Messages deleted     : ${msgDel.deletedCount}`);
    console.log(`🗑️  Conversations deleted: ${convDel.deletedCount}`);

    // 8. Delete Products posted by seed users
    const productsDel = await Product.deleteMany({ sellerId: { $in: seedUserIds } });
    console.log(`🗑️  Products deleted     : ${productsDel.deletedCount}`);

    // 9. Delete Services posted by seed users
    const servicesDel = await Service.deleteMany({ providerId: { $in: seedUserIds } });
    console.log(`🗑️  Services deleted     : ${servicesDel.deletedCount}`);

    // 10. Finally delete the seed users themselves
    const usersDel = await User.deleteMany({ _id: { $in: seedUserIds } });
    console.log(`🗑️  Users deleted        : ${usersDel.deletedCount}`);

    console.log('\n─────────────────────────────────────────');
    console.log('✅ Cleanup complete. All seed/dummy data has been removed.');
    console.log('   Real user accounts and their listings are preserved.\n');

    // Verification snapshot
    const remainingUsers    = await User.countDocuments();
    const remainingProducts = await Product.countDocuments();
    const remainingServices = await Service.countDocuments();
    console.log('📊 Remaining data after cleanup:');
    console.log(`   Users    : ${remainingUsers}`);
    console.log(`   Products : ${remainingProducts}`);
    console.log(`   Services : ${remainingServices}`);
    console.log('─────────────────────────────────────────\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
};

cleanup();
