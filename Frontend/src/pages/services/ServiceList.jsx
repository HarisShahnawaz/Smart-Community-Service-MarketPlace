import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Clock, Star, Briefcase, BadgeCheck } from 'lucide-react';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data.data);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger p-8 bg-danger/10 rounded-xl max-w-4xl mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-900">Services</h1>
          <p className="text-beige-600 mt-2">Hire talented professionals from your community</p>
        </div>
        <Link 
          to="/services/new" 
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          Offer a Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center bg-beige-50 border border-beige-300 rounded-2xl p-12">
          <p className="text-charcoal text-lg">No services available right now.</p>
          <p className="text-beige-600 mt-2">Be the first to offer your skills!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <Link 
              key={service._id} 
              to={`/services/${service._id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-beige-300 transition-shadow group flex flex-col"
            >
              <div className="relative h-48 bg-teal-900 overflow-hidden">
                {service.portfolioImages && service.portfolioImages.length > 0 ? (
                  <img 
                    src={service.portfolioImages[0]} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-teal-200">
                    <Briefcase className="w-12 h-12 opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  {!service.availability && (
                    <span className="bg-danger text-white px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={service.providerId?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                      alt="Provider" 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <span className="text-sm font-bold text-white drop-shadow-sm">
                      {service.providerId?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-medium border border-teal-100">
                    {service.category}
                  </span>
                  {service.providerId?.ratingAvg > 4.5 && (
                    <span className="flex items-center text-xs text-warning bg-warning/10 px-2.5 py-0.5 rounded-full font-bold">
                      <BadgeCheck className="w-3 h-3 mr-1" /> Top Rated
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                  {service.title}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-beige-600 mb-4">
                  <Star className="w-4 h-4 text-warning" />
                  <span className="font-bold text-charcoal">{service.providerId?.ratingAvg?.toFixed(1) || 0}</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-beige-100">
                  <div className="text-sm text-beige-600 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-teal-500" />
                    Up to {service.deliveryTimeInDays} days
                  </div>
                  <div className="text-lg font-bold text-teal-800">
                    <span className="text-xs text-beige-600 font-normal mr-1">Starts at</span>
                    ${service.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
