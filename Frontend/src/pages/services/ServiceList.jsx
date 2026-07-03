import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Clock, Star, Briefcase, Search, Filter, BadgeCheck } from 'lucide-react';
import FavoriteButton from '../../components/FavoriteButton';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const CATEGORIES = ['Web Development', 'Graphic Design', 'Tutoring', 'Home Repair', 'Cleaning', 'Photography', 'Writing', 'Other'];

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      const res = await api.get(`/services?${params.toString()}`);
      setServices(res.data.data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

      {/* Mobile Filter Toggle */}
      <button
        className="md:hidden flex items-center justify-center gap-2 bg-beige-200 text-charcoal py-3 rounded-xl font-medium"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <Filter className="w-5 h-5" /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Sidebar Filters */}
      <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="bg-beige-50 rounded-2xl p-6 border border-beige-300 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-teal-900 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h2>
            {(keyword || category || minPrice || maxPrice) && (
              <button onClick={clearFilters} className="text-sm text-danger hover:underline">Clear</button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <Search className="w-5 h-5 text-beige-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value="" checked={category === ''} onChange={() => setCategory('')} className="text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-charcoal">All Categories</span>
                </label>
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" value={cat} checked={category === cat} onChange={() => setCategory(cat)} className="text-teal-600 focus:ring-teal-500" />
                    <span className="text-sm text-charcoal">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Starting Price ($)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-beige-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                <span className="text-beige-500">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-beige-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors">
              Apply Filters
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-teal-900">Services</h1>
            <p className="text-beige-600 mt-1">Hire talented professionals from your community</p>
          </div>
          <Link to="/services/new" className="hidden sm:inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            Offer a Service
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-danger p-8 bg-danger/10 rounded-xl">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center bg-beige-50 border border-beige-300 rounded-2xl p-12">
            <p className="text-charcoal text-lg">No services found.</p>
            <p className="text-beige-600 mt-2">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-4 text-teal-600 font-medium hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-beige-300 transition-shadow group flex flex-col relative">
                <Link to={`/services/${service._id}`} className="block relative h-48 bg-teal-900 overflow-hidden">
                  {service.portfolioImages && service.portfolioImages.length > 0 ? (
                    <img src={service.portfolioImages[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-200">
                      <Briefcase className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  {!service.availability && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-danger text-white px-2 py-1 rounded-md text-xs font-bold uppercase">Unavailable</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <img src={service.providerId?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} alt="Provider" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                      <span className="text-sm font-bold text-white drop-shadow-sm">{service.providerId?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </Link>

                {/* Favorite Button */}
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton itemId={service._id} itemType="Service" />
                </div>

                <Link to={`/services/${service._id}`} className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-medium border border-teal-100">{service.category}</span>
                    {service.providerId?.ratingAvg > 4.5 && (
                      <span className="flex items-center text-xs text-warning bg-warning/10 px-2.5 py-0.5 rounded-full font-bold">
                        <BadgeCheck className="w-3 h-3 mr-1" /> Top Rated
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">{service.title}</h3>
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
                      <span className="text-xs text-beige-600 font-normal mr-1">From</span>${service.price}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
