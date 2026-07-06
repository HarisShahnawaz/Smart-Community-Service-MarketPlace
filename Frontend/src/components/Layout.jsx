import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Heart, MessageCircle, LayoutDashboard, Moon, Sun } from 'lucide-react';
import Notifications from './Notifications';

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-beige-100 text-charcoal'}`}>
      <nav className={`shadow-md sticky top-0 z-50 ${isDark ? 'bg-gray-800 text-white' : 'bg-teal-600 text-white'}`}>
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
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center hover:text-teal-200 transition-colors" title="Dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  <Link to="/profile" className="flex items-center hover:text-teal-200 transition-colors">
                    <UserIcon className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <Link to="/favorites" className="flex items-center hover:text-teal-200 transition-colors" title="My Favorites">
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link to="/chat" className="flex items-center hover:text-teal-200 transition-colors" title="Messages">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <Notifications />
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

      <footer className={`border-t py-6 mt-auto ${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-beige-200 border-beige-300 text-beige-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Smart Community Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
