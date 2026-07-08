import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';

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
        getUserActivity(10)
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link 
      to={link}
      className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md dark:hover:bg-dark-surface-elevated transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-dark-text-secondary text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  );

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
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
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
        return <TrendingUp className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />;
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
        <div className="w-10 h-10 border-4 border-teal-200 dark:border-dark-surface border-t-teal-600 dark:border-t-dark-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="My Products"
          value={stats?.counts?.products || 0}
          icon={Package}
          color="bg-teal-500"
          link="/profile?tab=products"
        />
        <StatCard
          title="My Services"
          value={stats?.counts?.services || 0}
          icon={Briefcase}
          color="bg-purple-500"
          link="/profile?tab=services"
        />
        <StatCard
          title="Bookings"
          value={stats?.counts?.bookings || 0}
          icon={Calendar}
          color="bg-blue-500"
          link="/bookings"
        />
        <StatCard
          title="Reviews Received"
          value={stats?.counts?.reviewsReceived || 0}
          icon={Star}
          color="bg-yellow-500"
          link="/profile?tab=reviews"
        />
        <StatCard
          title="Reviews Given"
          value={stats?.counts?.reviewsGiven || 0}
          icon={Star}
          color="bg-orange-500"
          link="/profile?tab=my-reviews"
        />
        <StatCard
          title="Favorites"
          value={stats?.counts?.favorites || 0}
          icon={Heart}
          color="bg-red-500"
          link="/favorites"
        />
      </div>

      {/* Rating Overview */}
      <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Your Rating</h2>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-gray-800 dark:text-dark-text-primary">
            {stats?.rating?.average || '0.0'}
          </div>
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats?.rating?.average || 0)
                      ? 'fill-yellow-400 text-yellow-400 dark:fill-dark-accent dark:text-dark-accent'
                      : 'text-gray-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 dark:text-dark-text-secondary text-sm mt-1">
              Based on {stats?.rating?.total || 0} reviews
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Recent Bookings</h2>
            <Link to="/bookings" className="text-teal-600 dark:text-dark-brand text-sm hover:text-teal-700 dark:hover:text-dark-brand-hover">
              View All
            </Link>
          </div>
          {stats?.recentBookings?.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-2">No bookings yet</p>
              <p className="text-slate-500 dark:text-dark-text-secondary text-sm mb-4">Browse services and book one to get started with your projects.</p>
              <Link to="/services" className="inline-flex items-center bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentBookings?.map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-dark-text-primary truncate">
                      {booking.serviceId?.title || 'Service'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                      ${booking.serviceId?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className="text-xs text-gray-500 dark:text-dark-text-secondary capitalize">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">Recent Reviews</h2>
            <Link to="/profile?tab=reviews" className="text-teal-600 dark:text-dark-brand text-sm hover:text-teal-700 dark:hover:text-dark-brand-hover">
              View All
            </Link>
          </div>
          {stats?.recentReviews?.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-2">No reviews yet</p>
              <p className="text-slate-500 dark:text-dark-text-secondary text-sm">Complete bookings to receive reviews from clients.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentReviews?.map((review) => (
                <div key={review._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-lg">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current dark:text-dark-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-dark-text-primary">
                      {review.reviewerId?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary truncate">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current dark:text-dark-accent" />
                    <span className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">{review.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-dark-text-primary font-medium mb-2">No recent activity</p>
              <p className="text-slate-500 dark:text-dark-text-secondary text-sm mb-4">Start by listing products, offering services, or booking services to see your activity here.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/products/new" className="inline-flex items-center bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  List Product
                </Link>
                <Link to="/services/new" className="inline-flex items-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Offer Service
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg dark:border dark:border-dark-border rounded-lg">
                  <div className="p-2 bg-gray-100 dark:bg-dark-surface-elevated rounded-lg">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-dark-text-primary truncate">
                      {item.type === 'product' && `Added product: ${item.title}`}
                      {item.type === 'service' && `Added service: ${item.title}`}
                      {item.type === 'booking' && `Booked service`}
                      {item.type === 'review' && `Wrote a review`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{formatTime(item.createdAt)}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-dark-text-secondary capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/products/new"
            className="flex flex-col items-center p-4 bg-teal-50 dark:bg-dark-bg/60 dark:border dark:border-dark-border hover:bg-teal-100 dark:hover:bg-dark-surface-elevated transition-colors rounded-lg"
          >
            <Package className="w-6 h-6 text-teal-600 dark:text-dark-brand mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">Sell Product</span>
          </Link>
          <Link
            to="/services/new"
            className="flex flex-col items-center p-4 bg-purple-50 dark:bg-dark-bg/60 dark:border dark:border-dark-border hover:bg-purple-100 dark:hover:bg-dark-surface-elevated transition-colors rounded-lg"
          >
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">Offer Service</span>
          </Link>
          <Link
            to="/products"
            className="flex flex-col items-center p-4 bg-blue-50 dark:bg-dark-bg/60 dark:border dark:border-dark-border hover:bg-blue-100 dark:hover:bg-dark-surface-elevated transition-colors rounded-lg"
          >
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">Browse Products</span>
          </Link>
          <Link
            to="/services"
            className="flex flex-col items-center p-4 bg-orange-50 dark:bg-dark-bg/60 dark:border dark:border-dark-border hover:bg-orange-100 dark:hover:bg-dark-surface-elevated transition-colors rounded-lg"
          >
            <Briefcase className="w-6 h-6 text-orange-600 dark:text-dark-accent mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">Find Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
