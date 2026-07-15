import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation } from '../../api/messageApi';
import { Clock, Star, ArrowLeft, Briefcase, Edit, Trash2, Calendar, MapPin, MessageCircle } from 'lucide-react';
import BookingModal from '../../components/BookingModal';
import SafeImage from '../../components/SafeImage';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data.data);
      } catch (err) {
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/services/${id}`);
      navigate('/services');
    } catch (err) {
      alert('Failed to delete service. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleMessage = async () => {
    try {
      const conversation = await getOrCreateConversation(service.providerId._id);
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      alert('Unable to start conversation. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center text-danger p-8 bg-danger/10 rounded-xl max-w-4xl mx-auto">
        {error || 'Service not found'}
      </div>
    );
  }

  const isOwner = currentUser && (currentUser._id === service.providerId._id || currentUser.role === 'admin');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/services" className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Link>

      {/* Admin/Owner Controls */}
      {isOwner && (
        <div className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              service.status === 'active' ? 'bg-success/20 text-success border border-success/30' :
              service.status === 'pending' ? 'bg-warning/20 text-warning border border-warning/30' :
              'bg-danger/20 text-danger border border-danger/30'
            }`}>
              {service.status}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Status</span>
          </div>
          <div className="flex gap-3">
            <Link 
              to={`/services/edit/${service._id}`}
              className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
            {/* Image Gallery */}
            {service.portfolioImages && service.portfolioImages.length > 0 ? (
              <div>
                <div className="aspect-video bg-slate-900 dark:bg-slate-800 w-full overflow-hidden">
                  <SafeImage 
                    src={service.portfolioImages[activeImage]} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.portfolioImages.length > 1 && (
                  <div className="flex gap-3 p-4 bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border overflow-x-auto custom-scrollbar">
                    {service.portfolioImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === idx ? 'border-brand-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <SafeImage src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-dark-border">
                <Briefcase className="w-16 h-16 mb-2 opacity-50" />
                <p>No portfolio images provided</p>
              </div>
            )}

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full font-medium border border-brand-100 dark:border-brand-800">
                  {service.category}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" /> Posted: {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                {service.title}
              </h1>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-dark-border pb-2 mb-4">About This Service</h3>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Card (Mobile/Tablet usually stacks, but here it's bottom on left side if we want, or we can keep it right side) */}
        </div>

        {/* Right: Booking Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border p-4 sm:p-6 sticky top-24">
            
            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-dark-border">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Starting at</p>
              <div className="text-3xl sm:text-4xl font-bold text-brand-600">
                ${service.price.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-slate-900 dark:text-white">
                <Clock className="w-5 h-5 text-brand-600 mr-3" />
                <span className="font-medium">Up to {service.deliveryTimeInDays} Days Delivery</span>
              </div>
              <div className="flex items-center text-slate-900 dark:text-white">
                <div className={`w-3 h-3 rounded-full mr-4 ml-1 ${service.availability ? 'bg-success' : 'bg-danger'}`}></div>
                <span className="font-medium">{service.availability ? 'Available for Work' : 'Currently Unavailable'}</span>
              </div>
            </div>

            {!isOwner ? (
              <button 
                onClick={() => setShowBookingModal(true)}
                disabled={!service.availability}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {service.availability ? 'Book Service' : 'Not Available'}
              </button>
            ) : (
              <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-center py-3.5 px-4 rounded-xl font-medium border border-slate-200 dark:border-slate-700">
                This is your service
              </div>
            )}
            
            {/* About Provider */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-border">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wider">About The Provider</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <Link to={`/profile/${service.providerId._id}`}>
                  <SafeImage 
                    src={service.providerId.avatar} 
                    alt={service.providerId.name} 
                    variant="avatar"
                    className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${service.providerId._id}`} className="font-bold text-lg text-slate-900 dark:text-white hover:text-brand-600 transition-colors">
                    {service.providerId.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="flex items-center text-accent-500 font-bold">
                      <Star className="w-4 h-4 mr-1 fill-accent-500" /> {service.providerId.ratingAvg?.toFixed(1) || 0}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">({service.providerId.ratingCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              {service.providerId.location && (service.providerId.location.city || service.providerId.location.country) && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  {[service.providerId.location.city, service.providerId.location.country].filter(Boolean).join(', ')}
                </div>
              )}

              {!isOwner && (
                <button 
                  onClick={handleMessage}
                  className="w-full border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Provider
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {showBookingModal && (
        <BookingModal 
          service={service} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </div>
  );
};

export default ServiceDetail;
