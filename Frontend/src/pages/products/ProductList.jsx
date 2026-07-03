import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { MapPin, Tag } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
          <h1 className="text-3xl font-extrabold text-teal-900">Marketplace</h1>
          <p className="text-beige-600 mt-2">Discover local items from your community</p>
        </div>
        <Link 
          to="/products/new" 
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          Sell an Item
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center bg-beige-50 border border-beige-300 rounded-2xl p-12">
          <p className="text-charcoal text-lg">No products available right now.</p>
          <p className="text-beige-600 mt-2">Be the first to list an item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <Link 
              key={product._id} 
              to={`/products/${product._id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-beige-300 transition-shadow group flex flex-col"
            >
              <div className="relative h-48 bg-beige-200 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-beige-500">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-teal-900 shadow-sm">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
                    {product.condition}
                  </span>
                  <span className="text-xs text-beige-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-1 group-hover:text-teal-700 transition-colors">
                  {product.title}
                </h3>
                
                <p className="text-sm text-beige-600 mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-beige-100">
                  <div className="flex items-center gap-2">
                    <img 
                      src={product.sellerId?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                      alt="Seller" 
                      className="w-6 h-6 rounded-full border border-beige-200"
                    />
                    <span className="text-xs font-medium text-charcoal truncate max-w-[100px]">
                      {product.sellerId?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-beige-600">
                    <MapPin className="w-3.5 h-3.5 text-teal-500" />
                    <span className="truncate max-w-[80px]">{product.location}</span>
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

export default ProductList;
