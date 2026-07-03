import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Clock, Star, ArrowLeft, Briefcase, Edit, Trash2, Calendar, MapPin } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/services/${id}`);
      navigate('/services');
    } catch (err) {
      alert('Failed to delete service');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
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
    <div className="max-w-6xl mx-auto">
      <Link to="/services" className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Link>

      {/* Admin/Owner Controls */}
      {isOwner && (
        <div className="bg-beige-50 border border-beige-300 rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              service.status === 'active' ? 'bg-success/20 text-success border border-success/30' :
              service.status === 'pending' ? 'bg-warning/20 text-warning border border-warning/30' :
              'bg-danger/20 text-danger border border-danger/30'
            }`}>
              {service.status}
            </span>
            <span className="text-sm text-beige-600 font-medium">Status</span>
          </div>
          <div className="flex gap-3">
            <Link 
              to={`/services/edit/${service._id}`}
              className="flex items-center gap-2 bg-beige-200 hover:bg-beige-300 text-charcoal px-4 py-2 rounded-lg transition-colors text-sm font-medium"
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
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 overflow-hidden">
            {/* Image Gallery */}
            {service.portfolioImages && service.portfolioImages.length > 0 ? (
              <div>
                <div className="aspect-video bg-teal-900 w-full overflow-hidden">
                  <img 
                    src={service.portfolioImages[activeImage]} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.portfolioImages.length > 1 && (
                  <div className="flex gap-3 p-4 bg-beige-50 border-b border-beige-200 overflow-x-auto custom-scrollbar">
                    {service.portfolioImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === idx ? 'border-teal-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-beige-200 flex flex-col items-center justify-center text-beige-500 border-b border-beige-200">
                <Briefcase className="w-16 h-16 mb-2 opacity-50" />
                <p>No portfolio images provided</p>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-beige-600 mb-4">
                <span className="flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium border border-teal-100">
                  {service.category}
                </span>
                <span className="flex items-center gap-1 bg-beige-100 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" /> Posted: {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-charcoal mb-6 leading-tight">
                {service.title}
              </h1>

              <div className="prose prose-teal max-w-none">
                <h3 className="text-xl font-bold text-charcoal border-b border-beige-200 pb-2 mb-4">About This Service</h3>
                <p className="text-charcoal whitespace-pre-line leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Provider Card (Mobile/Tablet usually stacks, but here it's bottom on left side if we want, or we can keep it right side) */}
        </div>

        {/* Right: Booking Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-beige-300 p-6 sticky top-24">
            
            <div className="mb-6 pb-6 border-b border-beige-200">
              <p className="text-sm text-beige-600 font-medium mb-1">Starting at</p>
              <div className="text-4xl font-bold text-teal-700">
                ${service.price.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-charcoal">
                <Clock className="w-5 h-5 text-teal-600 mr-3" />
                <span className="font-medium">Up to {service.deliveryTimeInDays} Days Delivery</span>
              </div>
              <div className="flex items-center text-charcoal">
                <div className={`w-3 h-3 rounded-full mr-4 ml-1 ${service.availability ? 'bg-success' : 'bg-danger'}`}></div>
                <span className="font-medium">{service.availability ? 'Available for Work' : 'Currently Unavailable'}</span>
              </div>
            </div>

            {!isOwner ? (
              <button 
                disabled={!service.availability}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 px-4 rounded-xl font-bold text-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {service.availability ? 'Book Service' : 'Not Available'}
              </button>
            ) : (
              <div className="w-full bg-beige-100 text-charcoal text-center py-3.5 px-4 rounded-xl font-medium border border-beige-300">
                This is your service
              </div>
            )}
            
            {/* About Provider */}
            <div className="mt-8 pt-6 border-t border-beige-200">
              <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">About The Provider</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <Link to={`/profile/${service.providerId._id}`}>
                  <img 
                    src={service.providerId.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                    alt={service.providerId.name} 
                    className="w-16 h-16 rounded-full border-2 border-beige-200 object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${service.providerId._id}`} className="font-bold text-lg text-charcoal hover:text-teal-700 transition-colors">
                    {service.providerId.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="flex items-center text-warning font-bold">
                      <Star className="w-4 h-4 mr-1 fill-warning" /> {service.providerId.ratingAvg?.toFixed(1) || 0}
                    </span>
                    <span className="text-beige-600">({service.providerId.ratingCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              {service.providerId.location && (
                <div className="flex items-center gap-2 text-sm text-beige-600 mb-4">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  {service.providerId.location}
                </div>
              )}

              {!isOwner && (
                <button className="w-full border border-teal-600 text-teal-700 hover:bg-teal-50 py-2.5 rounded-xl font-medium transition-colors">
                  Contact Me
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetail;
