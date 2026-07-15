import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Package, 
  Briefcase, 
  Calendar, 
  Star, 
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import SafeImage from '../../components/SafeImage';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Admin Panel
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.counts?.users || 0}
          icon={Users}
          color="bg-blue-500"
          link="/admin/users"
        />
        <StatCard
          title="Total Products"
          value={stats?.counts?.products || 0}
          icon={Package}
          color="bg-teal-500"
          link="/admin/products"
        />
        <StatCard
          title="Total Services"
          value={stats?.counts?.services || 0}
          icon={Briefcase}
          color="bg-purple-500"
          link="/admin/services"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.counts?.bookings || 0}
          icon={Calendar}
          color="bg-orange-500"
          link="/admin/bookings"
        />
        <StatCard
          title="Total Reviews"
          value={stats?.counts?.reviews || 0}
          icon={Star}
          color="bg-yellow-500"
          link="/admin/reviews"
        />
        <StatCard
          title="Pending Approvals"
          value={(stats?.counts?.pendingProducts || 0) + (stats?.counts?.pendingServices || 0)}
          icon={Clock}
          color="bg-red-500"
          link="/admin/approvals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            <Link to="/admin/users" className="text-teal-600 text-sm hover:text-teal-700">
              View All
            </Link>
          </div>
          {stats?.recentUsers?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">No users yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">Users will appear here once they register on the platform.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentUsers?.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <SafeImage 
                    src={user.avatar} 
                    alt={user.name} 
                    variant="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-teal-600 text-sm hover:text-teal-700">
              View All
            </Link>
          </div>
          {stats?.recentBookings?.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">No bookings yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">Bookings will appear here once users start booking services.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentBookings?.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {booking.userId?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {booking.serviceId?.title || 'Service'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
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
            to="/admin/approvals"
            className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Clock className="w-6 h-6 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Pending Approvals</span>
          </Link>
          <Link
            to="/admin/users"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </Link>
          <Link
            to="/admin/products"
            className="flex flex-col items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Package className="w-6 h-6 text-teal-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Products</span>
          </Link>
          <Link
            to="/admin/services"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
