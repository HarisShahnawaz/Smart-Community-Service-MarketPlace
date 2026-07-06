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
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
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
        return <Package className="w-5 h-5 text-teal-600" />;
      case 'service':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
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
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Rating</h2>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-gray-800">
            {stats?.rating?.average || '0.0'}
          </div>
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats?.rating?.average || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Based on {stats?.rating?.total || 0} reviews
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            <Link to="/bookings" className="text-teal-600 text-sm hover:text-teal-700">
              View All
            </Link>
          </div>
          {stats?.recentBookings?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentBookings?.map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {booking.serviceId?.title || 'Service'}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${booking.serviceId?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className="text-xs text-gray-500 capitalize">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Reviews</h2>
            <Link to="/profile?tab=reviews" className="text-teal-600 text-sm hover:text-teal-700">
              View All
            </Link>
          </div>
          {stats?.recentReviews?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentReviews?.map((review) => (
                <div key={review._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">
                      {review.reviewerId?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{review.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {item.type === 'product' && `Added product: ${item.title}`}
                      {item.type === 'service' && `Added service: ${item.title}`}
                      {item.type === 'booking' && `Booked service`}
                      {item.type === 'review' && `Wrote a review`}
                    </p>
                    <p className="text-sm text-gray-500">{formatTime(item.createdAt)}</p>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/products/new"
            className="flex flex-col items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Package className="w-6 h-6 text-teal-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Sell Product</span>
          </Link>
          <Link
            to="/services/new"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Offer Service</span>
          </Link>
          <Link
            to="/products"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Browse Products</span>
          </Link>
          <Link
            to="/services"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Find Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
