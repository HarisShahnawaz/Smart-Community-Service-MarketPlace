import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Calendar, MessageSquare, User, CheckCircle, XCircle, Clock, Star } from 'lucide-react';

const STATUS_STYLES = {
  pending:   { badge: 'bg-warning/20 text-warning border-warning/30', label: 'Pending' },
  accepted:  { badge: 'bg-success/20 text-success border-success/30', label: 'Accepted' },
  rejected:  { badge: 'bg-danger/20 text-danger border-danger/30', label: 'Rejected' },
  completed: { badge: 'bg-teal-100 text-teal-700 border-teal-300', label: 'Completed' },
  cancelled: { badge: 'bg-beige-200 text-beige-600 border-beige-300', label: 'Cancelled' }
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(newStatus);
    try {
      const res = await api.put(`/bookings/${id}/status`, { status: newStatus });
      setBooking(prev => ({ ...prev, status: res.data.data.status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center text-danger p-8 bg-danger/10 rounded-xl max-w-2xl mx-auto">
        {error || 'Booking not found'}
      </div>
    );
  }

  const isClient = currentUser?._id === booking.client?._id;
  const isProvider = currentUser?._id === booking.provider?._id;
  const status = booking.status;
  const statusInfo = STATUS_STYLES[status];

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/bookings" className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bookings
      </Link>

      <div className="space-y-6">
        {/* Status Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-beige-600 font-medium mb-1">Booking #{booking._id.slice(-6).toUpperCase()}</p>
            <h1 className="text-2xl font-extrabold text-charcoal">{booking.service?.title}</h1>
            <p className="text-beige-600 text-sm mt-1">
              Created on {new Date(booking.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`text-sm font-bold px-4 py-2 rounded-full border uppercase tracking-wider self-start ${statusInfo.badge}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6 space-y-5">
            <h2 className="font-bold text-lg text-teal-900 border-b border-beige-200 pb-3">Booking Details</h2>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-beige-600">Scheduled Date</p>
                <p className="font-bold text-charcoal">
                  {new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-beige-600">Total Price</p>
                <p className="font-bold text-2xl text-teal-700">${booking.totalPrice?.toFixed(2)}</p>
              </div>
            </div>

            {booking.message && (
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-beige-600 mb-1">Client's Message</p>
                  <p className="text-charcoal text-sm bg-beige-50 border border-beige-200 p-3 rounded-xl leading-relaxed">
                    {booking.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Parties */}
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6 space-y-5">
            <h2 className="font-bold text-lg text-teal-900 border-b border-beige-200 pb-3">People Involved</h2>

            {[
              { label: 'Client', person: booking.client },
              { label: 'Provider', person: booking.provider }
            ].map(({ label, person }) => (
              <div key={label} className="flex items-center gap-4">
                <img
                  src={person?.avatar}
                  alt={person?.name}
                  className="w-12 h-12 rounded-full border-2 border-beige-200 object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-beige-600 uppercase tracking-wider">{label}</p>
                  <p className="font-bold text-charcoal">{person?.name}</p>
                  {person?.contactNumber && (
                    <p className="text-sm text-beige-600">{person.contactNumber}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {status === 'pending' && (
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6">
            <h2 className="font-bold text-lg text-teal-900 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-4">
              {isProvider && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={!!updating}
                    className="flex items-center gap-2 bg-success hover:bg-success/90 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-60"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {updating === 'accepted' ? 'Accepting...' : 'Accept Booking'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={!!updating}
                    className="flex items-center gap-2 bg-danger hover:bg-danger/90 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-60"
                  >
                    <XCircle className="w-5 h-5" />
                    {updating === 'rejected' ? 'Rejecting...' : 'Reject Booking'}
                  </button>
                </>
              )}
              {isClient && (
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={!!updating}
                  className="flex items-center gap-2 border-2 border-danger text-danger hover:bg-danger/10 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-60"
                >
                  <XCircle className="w-5 h-5" />
                  {updating === 'cancelled' ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        )}

        {status === 'accepted' && isProvider && (
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6">
            <h2 className="font-bold text-lg text-teal-900 mb-4">Mark as Completed</h2>
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={!!updating}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-60"
            >
              <Clock className="w-5 h-5" />
              {updating === 'completed' ? 'Updating...' : 'Mark as Completed'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
