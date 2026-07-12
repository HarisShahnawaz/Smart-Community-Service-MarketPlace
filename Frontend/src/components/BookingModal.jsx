import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { X, Calendar, MessageSquare, DollarSign, Clock } from 'lucide-react';

const BookingModal = ({ service, onClose }) => {
  const navigate = useNavigate();
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window - tightened max-width and max-height */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white dark:bg-dark-surface border-t sm:border border-slate-200 dark:border-dark-border w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] sm:max-h-[78vh]"
        >
          {/* Header - reduced padding */}
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-base font-bold">Book This Service</h2>
              <p className="text-brand-100 text-[11px] mt-0.5 truncate max-w-[220px]">{service.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-brand-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            {/* Scrollable Content Body - reduced padding and spacing */}
            <div className="p-4 overflow-y-auto flex-grow space-y-3">
              {error && (
                <div className="bg-danger/10 border border-danger/30 text-danger px-3 py-2.5 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Pricing Summary - more compact */}
              <div className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg p-3 grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Starting Price</span>
                </div>
                <div className="font-bold text-brand-600 dark:text-brand-400 text-right">${service.price.toFixed(2)}</div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Delivery Time</span>
                </div>
                <div className="font-bold text-right text-slate-900 dark:text-white">Up to {service.deliveryTimeInDays} days</div>
              </div>

              {/* Date Picker - reduced spacing */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={minDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white transition-colors text-sm"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Select a date at least 24 hours from now</p>
              </div>

              {/* Message - reduced rows and spacing */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                  Message to Provider <span className="font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="2"
                  maxLength="500"
                  placeholder="Describe your requirements, timeline, or any questions..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white resize-none transition-colors text-sm"
                ></textarea>
                <div className="text-right text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{message.length}/500 characters</div>
              </div>
            </div>

            {/* Fixed Footer - reduced padding */}
            <div className="p-3.5 border-t border-slate-100 dark:border-dark-border flex gap-2.5 bg-slate-50/50 dark:bg-dark-surface/30 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : null}
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;