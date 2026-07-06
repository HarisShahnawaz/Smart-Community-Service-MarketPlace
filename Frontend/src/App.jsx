import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import ProfileView from './pages/profile/ProfileView';
import ProfileEdit from './pages/profile/ProfileEdit';

import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import CreateEditProduct from './pages/products/CreateEditProduct';

import ServiceList from './pages/services/ServiceList';
import ServiceDetail from './pages/services/ServiceDetail';
import CreateEditService from './pages/services/CreateEditService';

import FavoritesPage from './pages/FavoritesPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminApprovals from './pages/admin/AdminApprovals';

import MyBookings from './pages/bookings/MyBookings';
import BookingDetail from './pages/bookings/BookingDetail';

import ConversationsList from './pages/chat/ConversationsList';
import ChatView from './pages/chat/ChatView';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:resettoken" element={<ResetPassword />} />
          
          {/* Public Profile View */}
          <Route path="profile/:id" element={<ProfileView />} />
          
          {/* Public Product Routes */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Public Service Routes */}
          <Route path="services" element={<ServiceList />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="profile/edit" element={<ProfileEdit />} />
            
            <Route path="products/new" element={<CreateEditProduct />} />
            <Route path="products/edit/:id" element={<CreateEditProduct />} />
            
            <Route path="services/new" element={<CreateEditService />} />
            <Route path="services/edit/:id" element={<CreateEditService />} />

            <Route path="favorites" element={<FavoritesPage />} />

            <Route path="bookings" element={<MyBookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />

            <Route path="chat" element={<ConversationsList />} />
            <Route path="chat/:conversationId" element={<ChatView />} />

            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/approvals" element={<AdminApprovals />} />
          </Route>
        </Route>
      </Routes>
      </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
