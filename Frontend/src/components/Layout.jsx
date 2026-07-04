import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Heart } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-beige-100 font-sans text-charcoal">
      <nav className="bg-teal-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-6">
              <Link to="/" className="font-bold text-xl tracking-tight">
                Smart Community
              </Link>
              <Link to="/products" className="hidden sm:block text-teal-50 hover:text-white font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/services" className="hidden sm:block text-teal-50 hover:text-white font-medium transition-colors">
                Services
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center hover:text-teal-200 transition-colors">
                    <UserIcon className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <Link to="/favorites" className="flex items-center hover:text-teal-200 transition-colors" title="My Favorites">
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link to="/bookings" className="hidden sm:flex items-center hover:text-teal-200 transition-colors text-sm font-medium">
                    Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-teal-200 transition-colors font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-beige-50 text-teal-700 hover:bg-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-beige-200 border-t border-beige-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-beige-600">
          &copy; {new Date().getFullYear()} Smart Community Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
