import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Heart, MessageCircle, LayoutDashboard, Moon, Sun, Mail, Menu, X } from 'lucide-react';
import Notifications from './Notifications';
import { getUnreadCount } from '../api/messageApi';

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (user) {
      fetchUnreadMessageCount();
      const interval = setInterval(() => {
        fetchUnreadMessageCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadMessageCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadMessageCount(count);
    } catch (err) {
      console.error('Failed to fetch unread message count in Layout:', err);
    }
  };

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
              <Link to="/products" className="hidden sm:block text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/services" className="hidden sm:block text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium transition-colors">
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
                  <Link to="/dashboard" className="flex items-center hover:text-brand-200 dark:hover:text-dark-brand transition-colors" title="Dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  <Link to="/profile" className="flex items-center hover:text-brand-200 dark:hover:text-dark-brand transition-colors">
                    <UserIcon className="w-5 h-5 mr-1" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <Link to="/favorites" className="flex items-center hover:text-brand-200 dark:hover:text-dark-brand transition-colors" title="My Favorites">
                    <Heart className="w-5 h-5" />
                  </Link>
                  <Link to="/chat" className="flex items-center hover:text-brand-200 dark:hover:text-dark-brand transition-colors relative" title="Messages">
                    <MessageCircle className="w-5 h-5" />
                    {unreadMessageCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-brand-600 dark:ring-dark-surface">
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </span>
                    )}
                  </Link>
                  <Notifications />
                  <Link to="/bookings" className="hidden sm:flex items-center hover:text-brand-200 dark:hover:text-dark-brand transition-colors text-sm font-medium">
                    Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-brand-700 hover:bg-brand-800 dark:bg-dark-brand dark:hover:bg-dark-brand-hover dark:text-dark-bg px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-brand-200 dark:hover:text-dark-brand transition-colors font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-brand-700 hover:bg-brand-50 dark:bg-dark-brand dark:text-dark-bg dark:hover:bg-dark-brand-hover px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation Icons + Hamburger Button */}
            <div className="flex md:hidden items-center gap-1 sm:gap-2">
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 dark:hover:bg-dark-surface-elevated transition-colors text-current"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {user && (
                <>
                  {/* Messages Icon with Badge */}
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/chat"
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 dark:hover:bg-dark-surface-elevated transition-colors text-current relative"
                      title="Messages"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {unreadMessageCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-brand-600 dark:ring-dark-surface">
                          {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>

                  {/* Notifications Icon/Dropdown */}
                  <motion.div whileTap={{ scale: 0.95 }} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 dark:hover:bg-dark-surface-elevated transition-colors text-current">
                    <Notifications />
                  </motion.div>
                </>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-dark-surface-elevated transition-colors relative z-50 flex items-center justify-center w-10 h-10 text-current"
                aria-label="Toggle Menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between relative">
                  <motion.span
                    className="w-6 h-0.5 bg-current rounded"
                    animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-current rounded"
                    animate={mobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-current rounded"
                    animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Container */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />

              {/* Slide-out Menu Panel */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-40 p-6 pt-20 shadow-2xl md:hidden overflow-y-auto ${
                  isDark ? 'bg-dark-surface text-dark-text-primary border-l border-dark-border' : 'bg-brand-700 text-white'
                }`}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col space-y-4"
                >
                  <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }}>
                    <Link to="/products" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg block py-2" onClick={() => setMobileMenuOpen(false)}>
                      Marketplace
                    </Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }}>
                    <Link to="/services" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg block py-2" onClick={() => setMobileMenuOpen(false)}>
                      Services
                    </Link>
                  </motion.div>

                  {user ? (
                    <>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }} className="border-t border-white/20 dark:border-dark-border pt-4">
                        <Link to="/dashboard" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }}>
                        <Link to="/profile" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                          <UserIcon className="w-5 h-5" />
                          Profile ({user.name})
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }}>
                        <Link to="/favorites" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                          <Heart className="w-5 h-5" />
                          Favorites
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }}>
                        <Link to="/bookings" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                          Bookings
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }} className="pt-4">
                        <button
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                          className="flex items-center justify-center bg-brand-800 hover:bg-brand-900 dark:bg-dark-brand dark:hover:bg-dark-brand-hover dark:text-dark-bg px-4 py-3 rounded-xl transition-colors text-base font-semibold w-full gap-2 shadow-sm"
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }} className="border-t border-white/20 dark:border-dark-border pt-4">
                        <Link to="/login" className="text-brand-50 hover:text-white dark:text-dark-text-secondary dark:hover:text-dark-brand font-medium text-lg block py-2" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, x: 15 }, show: { opacity: 1, x: 0 } }} whileTap={{ scale: 0.95 }} className="pt-2">
                        <Link
                          to="/register"
                          className="bg-white text-brand-750 hover:bg-brand-50 dark:bg-dark-brand dark:text-dark-bg dark:hover:bg-dark-brand-hover px-4 py-3 rounded-xl font-semibold transition-colors shadow-md text-center block w-full text-base"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className={`border-t mt-auto ${isDark ? 'bg-dark-surface border-dark-border text-dark-text-secondary' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Press</Link></li>
                <li><Link to="#" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Marketplace</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Services</Link></li>
                <li><Link to="/favorites" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Favorites</Link></li>
                <li><Link to="/bookings" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">My Bookings</Link></li>
              </ul>
            </div>

            {/* Categories Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Electronics</Link></li>
                <li><Link to="/products" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Furniture</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">Graphic Design</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <Link to="mailto:support@smartcommunity.com" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors">support@smartcommunity.com</Link>
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:text-brand-600 dark:hover:text-dark-brand transition-colors" aria-label="Email">
                  <Mail className="w-5 h-5" />
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
