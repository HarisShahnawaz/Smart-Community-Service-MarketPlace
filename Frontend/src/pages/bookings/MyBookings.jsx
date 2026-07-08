import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, Clock, ChevronRight, Briefcase, Package } from 'lucide-react';

const STATUS_STYLES = {
  pending:   'bg-warning/20 text-warning border-warning/30',
  accepted:  'bg-success/20 text-success border-success/30',
  rejected:  'bg-danger/20 text-danger border-danger/30',
  completed: 'bg-teal-100 text-teal-700 border-teal-300',
  cancelled: 'bg-beige-200 text-beige-600 border-beige-300'
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('client');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/bookings?role=${activeTab}`);
        setBookings(res.data.data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-teal-600" />
        <h1 className="text-3xl font-extrabold text-teal-900">My Bookings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-beige-100 p-1.5 rounded-xl w-fit">
        {[
          { id: 'client', label: 'Services I Booked' },
          { id: 'provider', label: 'Orders I Received' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-teal-800 shadow-sm font-bold'
                : 'text-beige-600 hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl p-12 sm:p-16">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white text-xl font-bold mb-2">No bookings yet</p>
          <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
            {activeTab === 'client'
              ? 'You haven\'t booked any services yet. Browse our marketplace to find a trusted provider for your next project.'
              : 'Once clients book your services, they\'ll appear here. Keep your services active and respond quickly to inquiries!'}
          </p>
          {activeTab === 'client' && (
            <Link to="/services" className="inline-flex items-center mt-6 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const img = booking.service?.portfolioImages?.[0];
            const otherParty = activeTab === 'client' ? booking.provider : booking.client;
            return (
              <Link
                key={booking._id}
                to={`/bookings/${booking._id}`}
                className="flex items-center gap-5 bg-white border border-beige-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Service Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-beige-200">
                  {img ? (
                    <img src={img} alt="Service" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-beige-400">
                      <Briefcase className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-charcoal truncate group-hover:text-teal-700 transition-colors">
                    {booking.service?.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-beige-600">
                    <span className="flex items-center gap-1">
                      <img src={otherParty?.avatar} alt={otherParty?.name} className="w-5 h-5 rounded-full border border-beige-200 object-cover" />
                      {activeTab === 'client' ? 'Provider: ' : 'Client: '}{otherParty?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Booked {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                  <span className="font-bold text-teal-800">${booking.totalPrice?.toFixed(2)}</span>
                  <ChevronRight className="w-5 h-5 text-beige-400 group-hover:text-teal-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
