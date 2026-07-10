import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Heart, Package, Briefcase, ArrowRight } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data.data);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (itemId, itemType) => {
    try {
      await api.post('/favorites/toggle', { itemId, itemType });
      setFavorites(prev => prev.filter(fav => {
        if (itemType === 'Product') return fav.product?._id !== itemId;
        return fav.service?._id !== itemId;
      }));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (activeTab === 'products') return fav.itemType === 'Product';
    if (activeTab === 'services') return fav.itemType === 'Service';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-danger fill-danger" />
        <h1 className="text-3xl font-extrabold text-teal-900 dark:text-dark-text-primary">My Favorites</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-beige-100 dark:bg-dark-surface p-1.5 rounded-xl w-fit border border-transparent dark:border-dark-border">
        {[
          { id: 'all', label: 'All' },
          { id: 'products', label: 'Products' },
          { id: 'services', label: 'Services' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-dark-surface-elevated text-teal-800 dark:text-dark-brand shadow-sm font-bold'
                : 'text-beige-600 dark:text-dark-text-secondary hover:text-charcoal dark:hover:text-dark-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="text-center bg-beige-50 dark:bg-dark-surface border border-beige-300 dark:border-dark-border rounded-2xl p-16">
          <Heart className="w-16 h-16 text-beige-300 dark:text-dark-text-secondary mx-auto mb-4" />
          <p className="text-charcoal dark:text-dark-text-primary text-xl font-bold">Nothing saved yet</p>
          <p className="text-beige-600 dark:text-dark-text-secondary mt-2">Browse the marketplace and tap the heart icon to save items.</p>
          <div className="flex gap-4 justify-center mt-6">
            <Link to="/products" className="bg-teal-600 hover:bg-teal-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover dark:text-dark-bg text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Browse Products
            </Link>
            <Link to="/services" className="border border-teal-600 dark:border-dark-brand text-teal-700 dark:text-dark-brand px-6 py-2.5 rounded-xl font-medium hover:bg-teal-50 dark:hover:bg-dark-brand/10 transition-colors">
              Browse Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map(fav => {
            const isProduct = fav.itemType === 'Product';
            const item = isProduct ? fav.product : fav.service;
            if (!item) return null;

            const linkPath = isProduct ? `/products/${item._id}` : `/services/${item._id}`;
            const image = isProduct ? item.images?.[0] : item.portfolioImages?.[0];
            const seller = isProduct ? item.sellerId : item.providerId;
            const price = `$${item.price?.toFixed(2)}`;

            return (
              <div key={fav._id} className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-beige-300 dark:border-dark-border flex flex-col group transition-shadow">
                <div className="relative h-44 bg-beige-200 dark:bg-dark-surface-elevated overflow-hidden">
                  {image ? (
                    <img src={image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-beige-400 dark:text-dark-text-secondary">
                      {isProduct ? <Package className="w-10 h-10" /> : <Briefcase className="w-10 h-10" />}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isProduct ? 'bg-teal-600 text-white dark:bg-dark-brand dark:text-dark-bg' : 'bg-charcoal text-white dark:bg-dark-surface-elevated dark:text-dark-text-primary dark:border dark:border-dark-border'}`}>
                      {isProduct ? 'Product' : 'Service'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id, fav.itemType)}
                    className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-dark-surface-elevated/80 text-danger rounded-full hover:bg-white dark:hover:bg-dark-surface transition-colors shadow-sm"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-charcoal dark:text-dark-text-primary line-clamp-2 mb-1 group-hover:text-teal-700 dark:group-hover:text-dark-brand transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-teal-700 dark:text-dark-brand font-bold text-lg mb-3">{price}</div>
                  <div className="flex items-center gap-2 mb-4">
                    <img src={seller?.avatar} alt={seller?.name} className="w-6 h-6 rounded-full border border-beige-200 dark:border-dark-border object-cover" />
                    <span className="text-xs text-beige-600 dark:text-dark-text-secondary truncate">{seller?.name}</span>
                  </div>
                  <Link to={linkPath} className="mt-auto flex items-center justify-center gap-2 bg-beige-100 dark:bg-dark-surface-elevated hover:bg-teal-50 dark:hover:bg-dark-brand/10 text-teal-700 dark:text-dark-brand font-medium text-sm py-2.5 rounded-xl border border-beige-200 dark:border-dark-border hover:border-teal-300 dark:hover:border-dark-brand/30 transition-colors">
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
