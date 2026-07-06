const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// We will skip connecting to MongoDB in this first setup step if it's not strictly necessary, 
// but since the task mentions it, let's connect to it and see if the user's mongod is running. 
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io - Real-time chat
// Map userId -> socketId for targeted message delivery
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Client emits their userId after connecting so we can track them
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  // Send a message in real-time
  socket.on('send_message', (data) => {
    // data: { conversationId, message }
    // Broadcast to everyone in the room (except sender)
    socket.to(data.conversationId).emit('receive_message', data.message);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    // data: { conversationId, userId, name }
    socket.to(data.conversationId).emit('user_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.conversationId).emit('user_stop_typing', data);
  });

  // Notification events
  socket.on('notification_read', (notificationId) => {
    // Broadcast to sender that notification was read (if needed)
    socket.emit('notification_acknowledged', { notificationId });
  });

  // Send notification to specific user
  socket.on('send_notification', (data) => {
    // data: { recipientId, notification }
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_notification', data.notification);
    }
  });

  socket.on('disconnect', () => {
    // Remove user from online map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Health-check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running normally' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
