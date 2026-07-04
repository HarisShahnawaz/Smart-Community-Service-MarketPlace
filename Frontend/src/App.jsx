import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

import MyBookings from './pages/bookings/MyBookings';
import BookingDetail from './pages/bookings/BookingDetail';

function App() {
  return (
    <AuthProvider>
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
            <Route path="profile" element={<ProfileView />} />
            <Route path="profile/edit" element={<ProfileEdit />} />
            
            <Route path="products/new" element={<CreateEditProduct />} />
            <Route path="products/edit/:id" element={<CreateEditProduct />} />
            
            <Route path="services/new" element={<CreateEditService />} />
            <Route path="services/edit/:id" element={<CreateEditService />} />

            <Route path="favorites" element={<FavoritesPage />} />

            <Route path="bookings" element={<MyBookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
