import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Heart, MessageCircle, LayoutDashboard, Moon, Sun, Github, Twitter, Linkedin, Mail, Menu, X } from 'lucide-react';
import Notifications from './Notifications';

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'bg-dark-bg text-dark-text-primary' : 'bg-slate-50 text-light-text-primary'}`}>
      <nav className={`shadow-md sticky top-0 z-50 ${isDark ? 'bg-dark-surface text-dark-text-primary border-b border-dark-border' : 'bg-brand-600 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-6">
              <Link to="/" className="font-bold text-xl tracking-tight">
                Smart Community
              </Link>
              <Link to="/products" className="hidden sm:block text-brand-50 hover:text-white font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/services" className="hidden sm:block text-brand-50 hover:text-white font-medium transition-colors">
                Services
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center hover:text-brand-200 transition-colors" title="Dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  <Link to="/profile" className="flex items-center hover:text-brand-200 transition-colors">
                    <UserIcon className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <Link to="/favorites" className="flex items-center hover:text-brand-200 transition-colors" title="My Favorites">
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link to="/chat" className="flex items-center hover:text-brand-200 transition-colors" title="Messages">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <Notifications />
                  <Link to="/bookings" className="hidden sm:flex items-center hover:text-brand-200 transition-colors text-sm font-medium">
                    Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-brand-700 hover:bg-brand-800 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-brand-200 transition-colors font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-3">
                <Link to="/products" className="text-brand-50 hover:text-white font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Marketplace
                </Link>
                <Link to="/services" className="text-brand-50 hover:text-white font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 text-brand-50 hover:text-white font-medium transition-colors w-full"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-brand-50 hover:text-white font-medium transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="text-brand-50 hover:text-white font-medium transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <UserIcon className="w-5 h-5" />
                      Profile
                    </Link>
                    <Link to="/favorites" className="text-brand-50 hover:text-white font-medium transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="w-5 h-5" />
                      Favorites
                    </Link>
                    <Link to="/chat" className="text-brand-50 hover:text-white font-medium transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <MessageCircle className="w-5 h-5" />
                      Messages
                    </Link>
                    <Link to="/bookings" className="text-brand-50 hover:text-white font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Bookings
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center bg-brand-700 hover:bg-brand-800 px-4 py-2 rounded-lg transition-colors text-sm font-medium w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-brand-50 hover:text-white font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className={`border-t mt-auto ${isDark ? 'bg-dark-surface border-dark-border text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-brand-600 transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-brand-600 transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-brand-600 transition-colors">Press</Link></li>
                <li><Link to="#" className="hover:text-brand-600 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-brand-600 transition-colors">Marketplace</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 transition-colors">Services</Link></li>
                <li><Link to="/favorites" className="hover:text-brand-600 transition-colors">Favorites</Link></li>
                <li><Link to="/bookings" className="hover:text-brand-600 transition-colors">My Bookings</Link></li>
              </ul>
            </div>

            {/* Categories Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-brand-600 transition-colors">Electronics</Link></li>
                <li><Link to="/products" className="hover:text-brand-600 transition-colors">Furniture</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 transition-colors">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 transition-colors">Graphic Design</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <Link to="mailto:support@smartcommunity.com" className="hover:text-brand-600 transition-colors">support@smartcommunity.com</Link>
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:text-brand-600 transition-colors" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-brand-600 transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-brand-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-dark-border pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Smart Community Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
