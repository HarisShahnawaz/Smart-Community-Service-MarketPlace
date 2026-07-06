# Smart Community Marketplace

A full-stack community marketplace application for buying/selling products and offering services with real-time messaging, reviews, and admin management.

## Features

### User Features
- **Authentication**: User registration, login, password reset
- **Product Marketplace**: Browse, search, filter, and list products for sale
- **Service Marketplace**: Browse, search, filter, and offer services
- **Booking System**: Book services with status tracking (pending, accepted, completed, cancelled)
- **Real-time Messaging**: Socket.io-powered chat between users
- **Reviews & Ratings**: Rate and review users, products, and services with automatic rating recalculation
- **Favorites**: Save products and services to favorites
- **User Dashboard**: View statistics, recent activity, and quick actions
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: Overview of platform statistics
- **User Management**: View, edit roles, suspend, and delete users
- **Content Approval**: Approve or reject pending products and services
- **Listing Management**: View all products, services, and bookings
- **Search & Pagination**: Efficient data browsing with pagination

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image storage
- **express-validator** for input validation
- **multer** for file uploads

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time features
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Framer Motion** for animations

## Project Structure

```
Smart-Community-Marketplace/
├── Backend/
│   ├── config/          # Database and Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, upload
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/         # API service functions
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React contexts (Auth, Socket, Theme)
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas connection)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-community
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Services
- `GET /api/services` - Get all services (with pagination)
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (protected)
- `PUT /api/services/:id` - Update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)

### Bookings
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id/status` - Update booking status (protected)

### Messages
- `GET /api/messages/conversations` - Get user conversations (protected)
- `POST /api/messages/conversations` - Create conversation (protected)
- `GET /api/messages/conversations/:id` - Get conversation messages (protected)
- `POST /api/messages/conversations/:id` - Send message (protected)
- `GET /api/messages/unread-count` - Get unread count (protected)

### Reviews
- `GET /api/reviews/:targetType/:targetId` - Get target reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/my-reviews` - Get user's reviews (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/unread` - Get unread notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get user dashboard stats (protected)
- `GET /api/dashboard/activity` - Get user recent activity (protected)

### Admin (Admin Only)
- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users (with pagination)
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Get all products
- `GET /api/admin/products/pending` - Get pending products
- `PUT /api/admin/products/:id/status` - Update product status
- `GET /api/admin/services` - Get all services
- `GET /api/admin/services/pending` - Get pending services
- `PUT /api/admin/services/:id/status` - Update service status
- `GET /api/admin/bookings` - Get all bookings

## Socket.io Events

### Client → Server
- `user_online` - Register user as online
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `notification_read` - Mark notification as read
- `send_notification` - Send notification to user

### Server → Client
- `online_users` - List of online users
- `receive_message` - Receive new message
- `user_typing` - User is typing indicator
- `user_stop_typing` - User stopped typing
- `receive_notification` - Receive new notification
- `notification_acknowledged` - Notification read confirmation

## User Roles

- **user**: Regular user with access to all standard features
- **admin**: Administrator with access to admin panel and management features

## Data Models

### User
- name, email, password, avatar, bio, contactNumber
- location (city, country), skills, role
- ratingAvg, ratingCount, isSuspended

### Product
- title, description, images, price, category
- condition (new/used), location, sellerId
- status (pending/active/rejected/sold)
- ratingAvg, ratingCount

### Service
- title, description, price, deliveryTimeInDays
- category, portfolioImages, availability, providerId
- status (pending/active/rejected)
- ratingAvg, ratingCount

### Booking
- service, client, provider, message, scheduledDate
- totalPrice, status (pending/accepted/rejected/completed/cancelled)

### Review
- reviewerId, targetId, targetType (User/Service/Product)
- rating (1-5), comment, bookingId

### Notification
- recipientId, type, title, message
- relatedId, relatedModel, isRead

## Development

### Adding New Features

1. **Backend**: Create model → controller → route → add to server.js
2. **Frontend**: Create API function → component/page → add route to App.jsx

### Code Style

- Use functional components with hooks
- Follow existing naming conventions
- Add input validation to all forms
- Use pagination for list endpoints
- Handle errors gracefully
- Add loading states for async operations

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Configure Cloudinary for production
4. Deploy to a hosting service (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Set `VITE_API_URL` to production backend URL
3. Deploy to Vercel, Netlify, or similar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the repository.
