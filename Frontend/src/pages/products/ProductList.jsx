import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { MapPin, Tag, Search, Filter, X, ShoppingBag } from 'lucide-react';
import FavoriteButton from '../../components/FavoriteButton';
import SafeImage from '../../components/SafeImage';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';

const ProductList = () => {
  const { user: currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };
  
  // Search & Filter State
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Sports', 'Other'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
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
        className="md:hidden flex items-center justify-center gap-2 bg-beige-200 dark:bg-dark-surface border border-transparent dark:border-dark-border text-charcoal dark:text-dark-text-primary py-3 rounded-xl font-medium"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <Filter className="w-5 h-5" /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Sidebar Filters */}
      <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="bg-beige-50 dark:bg-dark-surface rounded-2xl p-6 border border-beige-300 dark:border-dark-border sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-teal-900 dark:text-dark-text-primary flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h2>
            {(keyword || category || minPrice || maxPrice) && (
              <button onClick={clearFilters} className="text-sm text-danger hover:underline">Clear</button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-dark-text-secondary mb-2">Search</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-surface-elevated border border-beige-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-brand outline-none text-charcoal dark:text-dark-text-primary placeholder-slate-400 dark:placeholder-slate-500"
                />
                <Search className="w-5 h-5 text-beige-500 dark:text-dark-text-secondary absolute left-3 top-3" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-dark-text-secondary mb-2">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="" 
                    checked={category === ''} 
                    onChange={() => setCategory('')}
                    className="text-teal-600 dark:text-dark-brand focus:ring-teal-500 dark:focus:ring-dark-brand bg-white dark:bg-dark-surface-elevated border border-beige-300 dark:border-dark-border" 
                  />
                  <span className="text-sm text-charcoal dark:text-dark-text-secondary">All Categories</span>
                </label>
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat} 
                      checked={category === cat} 
                      onChange={() => setCategory(cat)}
                      className="text-teal-600 dark:text-dark-brand focus:ring-teal-500 dark:focus:ring-dark-brand bg-white dark:bg-dark-surface-elevated border border-beige-300 dark:border-dark-border" 
                    />
                    <span className="text-sm text-charcoal dark:text-dark-text-secondary">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-dark-text-secondary mb-2">Price Range ($)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-surface-elevated border border-beige-300 dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-brand outline-none text-charcoal dark:text-dark-text-primary placeholder-slate-400 dark:placeholder-slate-500"
                />
                <span className="text-beige-500 dark:text-dark-text-secondary">-</span>
                <input 
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-surface-elevated border border-beige-300 dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 dark:focus:ring-dark-brand outline-none text-charcoal dark:text-dark-text-primary placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-teal-600 dark:bg-dark-brand text-white dark:text-dark-bg py-2.5 rounded-xl font-medium hover:bg-teal-700 dark:hover:bg-dark-brand-hover transition-colors">
              Apply Filters
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-teal-900 dark:text-dark-text-primary">Marketplace</h1>
            <p className="text-beige-600 dark:text-dark-text-secondary mt-1">Discover local items from your community</p>
          </div>
          <Link 
            to="/products/new" 
            className="hidden sm:inline-block bg-teal-600 hover:bg-teal-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover dark:text-dark-bg text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            Sell an Item
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-danger p-8 bg-danger/10 rounded-xl">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center bg-beige-50 dark:bg-dark-surface border border-beige-300 dark:border-dark-border rounded-2xl p-12">
            <p className="text-charcoal dark:text-dark-text-primary text-lg">No products found.</p>
            <p className="text-beige-600 dark:text-dark-text-secondary mt-2">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-4 text-teal-600 dark:text-dark-brand font-medium hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-beige-300 dark:border-dark-border transition-shadow group flex flex-col relative"
              >
                <Link to={`/products/${product._id}`} className="block relative h-48 bg-beige-200 dark:bg-dark-surface-elevated overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <SafeImage 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-beige-500 dark:text-dark-text-secondary">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-dark-surface-elevated/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-teal-900 dark:text-dark-brand shadow-sm">
                    ${product.price.toFixed(2)}
                  </div>
                </Link>
                
                {/* Favorite Button */}
                <div className="absolute top-3 left-3 z-10">
                  <FavoriteButton itemId={product._id} itemType="Product" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <Link to={`/products/${product._id}`} className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-teal-50 dark:bg-dark-brand/10 text-teal-700 dark:text-dark-brand px-2.5 py-0.5 rounded-full border border-teal-100 dark:border-dark-brand/20 uppercase tracking-wider">
                        {product.condition}
                      </span>
                      <span className="text-xs text-beige-600 dark:text-dark-text-secondary flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-charcoal dark:text-dark-text-primary mb-2 line-clamp-1 group-hover:text-teal-700 dark:group-hover:text-dark-brand transition-colors">
                      {product.title}
                    </h3>
                    
                    <p className="text-sm text-beige-600 dark:text-dark-text-secondary mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-beige-100 dark:border-dark-border">
                      <div className="flex items-center gap-2">
                        <SafeImage 
                          src={product.sellerId?.avatar} 
                          alt="Seller" 
                          variant="avatar"
                          className="w-6 h-6 rounded-full border border-beige-200 dark:border-dark-border object-cover"
                        />
                        <span className="text-xs font-medium text-charcoal dark:text-dark-text-primary truncate max-w-[100px]">
                          {product.sellerId?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-beige-600 dark:text-dark-text-secondary">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 dark:text-dark-brand" />
                        <span className="truncate max-w-[80px]">{product.location}</span>
                      </div>
                    </div>
                  </Link>

                  {(!currentUser || currentUser._id !== product.sellerId?._id) && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBuyNow(product)}
                      className="w-full mt-4 bg-teal-600 hover:bg-teal-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover dark:text-dark-bg text-white py-2 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Buy Now
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={selectedProduct}
        onOrderSuccess={() => fetchProducts()}
      />
    </div>
  );
};

export default ProductList;
