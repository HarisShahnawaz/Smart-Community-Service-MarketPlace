import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { X, Calendar, MessageSquare, DollarSign, Clock } from 'lucide-react';

const BookingModal = ({ service, onClose }) => {
  const navigate = useNavigate();
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Minimum date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/bookings', {
        serviceId: service._id,
        scheduledDate,
        message
      });
      onClose();
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-brand-600 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Book This Service</h2>
            <p className="text-brand-100 text-sm mt-0.5 truncate max-w-xs">{service.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Pricing Summary */}
          <div className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <DollarSign className="w-4 h-4 text-brand-600" />
              <span className="text-slate-600 dark:text-slate-400">Starting Price</span>
            </div>
            <div className="font-bold text-brand-600 dark:text-brand-400 text-right">${service.price.toFixed(2)}</div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-brand-600" />
              <span className="text-slate-600 dark:text-slate-400">Delivery Time</span>
            </div>
            <div className="font-bold text-right text-slate-900 dark:text-white">Up to {service.deliveryTimeInDays} days</div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Preferred Start Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              min={minDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white transition-colors"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a date at least 24 hours from now</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              Message to Provider <span className="text-slate-500 dark:text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              maxLength="500"
              placeholder="Describe your requirements, timeline, or any questions you have for the provider..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white resize-none transition-colors"
            ></textarea>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">{message.length}/500 characters</div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : null}
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
