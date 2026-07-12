import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserStats, getUserActivity } from '../api/dashboardApi';
import {
  Package,
  Briefcase,
  Calendar,
  Star,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

// ─── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.07 },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, link, emptyHint }) => (
  <motion.div variants={fadeUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
    <Link
      to={link}
      className="flex flex-col gap-4 bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border hover:shadow-md dark:hover:bg-dark-surface-elevated transition-all h-full"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 dark:text-dark-text-secondary text-sm font-medium">{title}</p>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-dark-text-primary mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {value === 0 && emptyHint && (
        <p className="text-xs text-slate-400 dark:text-dark-text-secondary leading-snug border-t border-slate-100 dark:border-dark-border pt-3">
          {emptyHint}
        </p>
      )}
    </Link>
  </motion.div>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, actionLabel, actionTo }) => (
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary">{title}</h2>
    {actionLabel && (
      <Link
        to={actionTo}
        className="text-brand-600 dark:text-dark-brand text-sm hover:text-brand-700 dark:hover:text-dark-brand-hover flex items-center gap-1"
      >
        {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        getUserStats(),
        getUserActivity(10),
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'product':
        return <Package className="w-5 h-5 text-teal-600 dark:text-dark-brand" />;
      case 'service':
        return <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500 dark:text-dark-accent" />;
      default:
        return <TrendingUp className="w-5 h-5 text-slate-400 dark:text-dark-text-secondary" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-brand-200 dark:border-dark-surface border-t-brand-600 dark:border-t-dark-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-dark-text-primary">Dashboard</h1>
        <p className="text-slate-500 dark:text-dark-text-secondary mt-1 text-sm">Welcome back — here's what's happening.</p>
      </motion.div>

      {/* ── Overview Stats ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-4">
          Overview
        </p>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            title="My Products"
            value={stats?.counts?.products || 0}
            icon={Package}
            color="bg-teal-500"
            link="/profile?tab=products"
            emptyHint="List your first product to start selling in the community."
          />
          <StatCard
            title="My Services"
            value={stats?.counts?.services || 0}
            icon={Briefcase}
            color="bg-purple-500"
            link="/profile?tab=services"
            emptyHint="Offer a service and get your first booking today."
          />
          <StatCard
            title="Bookings"
            value={stats?.counts?.bookings || 0}
            icon={Calendar}
            color="bg-blue-500"
            link="/bookings"
            emptyHint="Browse services and book one to get started."
          />
          <StatCard
            title="Reviews Received"
            value={stats?.counts?.reviewsReceived || 0}
            icon={Star}
            color="bg-yellow-500"
            link="/profile?tab=reviews"
            emptyHint="Complete bookings to start receiving reviews."
          />
          <StatCard
            title="Reviews Given"
            value={stats?.counts?.reviewsGiven || 0}
            icon={Star}
            color="bg-orange-500"
            link="/profile?tab=my-reviews"
            emptyHint="Share feedback on services you've booked."
          />
          <StatCard
            title="Favorites"
            value={stats?.counts?.favorites || 0}
            icon={Heart}
            color="bg-rose-500"
            link="/favorites"
            emptyHint="Heart listings you love to save them here."
          />
          <StatCard
            title="My Purchases"
            value={stats?.counts?.purchases || 0}
            icon={ShoppingBag}
            color="bg-teal-600"
            link="/orders"
            emptyHint="Products you purchase will show up here."
          />
          <StatCard
            title="My Sales"
            value={stats?.counts?.sales || 0}
            icon={Package}
            color="bg-emerald-600"
            link="/orders"
            emptyHint="Products other users buy from you."
          />
        </motion.div>
      </div>

      {/* ── Reputation ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-4">
          Reputation
        </p>
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-6">
            <div className="text-5xl font-extrabold text-slate-800 dark:text-dark-text-primary leading-none">
              {stats?.rating?.average || '0.0'}
            </div>
            <div>
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats?.rating?.average || 0)
                        ? 'fill-yellow-400 text-yellow-400 dark:fill-dark-accent dark:text-dark-accent'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-500 dark:text-dark-text-secondary text-sm">
                Based on {stats?.rating?.total || 0} {stats?.rating?.total === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Bookings & Reviews ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
          <SectionHeader title="Recent Bookings" actionLabel="View All" actionTo="/bookings" />
          {stats?.recentBookings?.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-1 text-sm">No bookings yet</p>
              <p className="text-slate-400 dark:text-dark-text-secondary text-xs mb-4">Browse services and book one to get started.</p>
              <Link
                to="/services"
                className="inline-flex items-center bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentBookings?.map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-dark-text-primary truncate text-sm">
                      {booking.serviceId?.title || 'Service'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary">
                      ${booking.serviceId?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {getStatusIcon(booking.status)}
                    <span className="text-xs text-slate-500 dark:text-dark-text-secondary capitalize">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
          <SectionHeader title="Recent Reviews" actionLabel="View All" actionTo="/profile?tab=reviews" />
          {stats?.recentReviews?.length === 0 ? (
            <div className="text-center py-10">
              <Star className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-1 text-sm">No reviews yet</p>
              <p className="text-slate-400 dark:text-dark-text-secondary text-xs">Complete bookings to receive reviews from clients.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentReviews?.map((review) => (
                <div key={review._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-xl">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg shrink-0">
                    <Star className="w-4 h-4 text-yellow-500 fill-current dark:text-dark-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-dark-text-primary text-sm">
                      {review.reviewerId?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary truncate">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current dark:text-dark-accent" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-dark-text-primary">{review.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Recent Activity ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border"
      >
        <SectionHeader title="Recent Activity" />
        {activity.length === 0 ? (
          <div className="text-center py-10">
            <TrendingUp className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-1 text-sm">No recent activity</p>
            <p className="text-slate-400 dark:text-dark-text-secondary text-xs mb-5">
              Start by listing products, offering services, or booking services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products/new"
                className="inline-flex items-center bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                List Product
              </Link>
              <Link
                to="/services/new"
                className="inline-flex items-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Offer Service
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-xl">
                <div className="p-2 bg-slate-100 dark:bg-dark-surface-elevated rounded-lg shrink-0">
                  {getActivityIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-dark-text-primary truncate text-sm">
                    {item.type === 'product' && `Added product: ${item.title}`}
                    {item.type === 'service' && `Added service: ${item.title}`}
                    {item.type === 'booking' && `Booked service`}
                    {item.type === 'review' && `Wrote a review`}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-dark-text-secondary">{formatTime(item.createdAt)}</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-dark-text-secondary capitalize bg-slate-100 dark:bg-dark-surface-elevated px-2 py-0.5 rounded-full shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border"
      >
        <h2 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { to: '/products/new', icon: Package, label: 'Sell Product', bg: 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30', icon_color: 'text-teal-600 dark:text-dark-brand' },
            { to: '/services/new', icon: Briefcase, label: 'Offer Service', bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30', icon_color: 'text-purple-600 dark:text-purple-400' },
            { to: '/products', icon: Package, label: 'Browse Products', bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30', icon_color: 'text-blue-600 dark:text-blue-400' },
            { to: '/services', icon: Briefcase, label: 'Find Services', bg: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30', icon_color: 'text-orange-600 dark:text-dark-accent' },
          ].map((action) => (
            <motion.div key={action.to} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={action.to}
                className={`flex flex-col items-center p-4 ${action.bg} dark:border dark:border-dark-border transition-colors rounded-xl`}
              >
                <action.icon className={`w-6 h-6 ${action.icon_color} mb-2`} />
                <span className="text-sm font-medium text-slate-700 dark:text-dark-text-primary text-center">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
