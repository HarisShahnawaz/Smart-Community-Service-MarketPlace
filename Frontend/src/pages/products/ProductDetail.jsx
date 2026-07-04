import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation } from '../../api/messageApi';
import { MapPin, Tag, ArrowLeft, Star, Clock, User, CheckCircle, Edit, Trash2, MessageCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      navigate('/products');
    } catch (err) {
      alert('Failed to delete product');
      setIsDeleting(false);
    }
  };

  const handleMessage = async () => {
    try {
      const conversation = await getOrCreateConversation(product.sellerId._id);
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      alert('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-danger p-8 bg-danger/10 rounded-xl max-w-4xl mx-auto">
        {error || 'Product not found'}
      </div>
    );
  }

  const isOwner = currentUser && (currentUser._id === product.sellerId._id || currentUser.role === 'admin');

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/products" className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Link>

      {/* Admin/Owner Controls */}
      {isOwner && (
        <div className="bg-beige-50 border border-beige-300 rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              product.status === 'active' ? 'bg-success/20 text-success border border-success/30' :
              product.status === 'pending' ? 'bg-warning/20 text-warning border border-warning/30' :
              'bg-danger/20 text-danger border border-danger/30'
            }`}>
              {product.status}
            </span>
            <span className="text-sm text-beige-600 font-medium">Status</span>
          </div>
          <div className="flex gap-3">
            <Link 
              to={`/products/edit/${product._id}`}
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

      <div className="bg-white rounded-2xl shadow-sm border border-beige-300 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Images */}
        <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-beige-200 bg-beige-50">
          <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 border border-beige-200">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-beige-400">
                No images available
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-teal-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-charcoal mb-2 leading-tight">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-beige-600">
                <span className="flex items-center gap-1 bg-beige-100 px-2 py-1 rounded-md">
                  <Tag className="w-4 h-4" /> {product.category}
                </span>
                <span className="flex items-center gap-1 bg-beige-100 px-2 py-1 rounded-md">
                  <CheckCircle className="w-4 h-4" /> Condition: <span className="capitalize">{product.condition}</span>
                </span>
                <span className="flex items-center gap-1 bg-beige-100 px-2 py-1 rounded-md">
                  <Clock className="w-4 h-4" /> {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="text-4xl font-bold text-teal-700 mb-6">
            ${product.price.toFixed(2)}
          </div>

          <div className="prose prose-teal max-w-none mb-8">
            <h3 className="text-lg font-bold text-charcoal border-b border-beige-200 pb-2 mb-3">Description</h3>
            <p className="text-charcoal whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Card */}
          <div className="mt-auto pt-6 border-t border-beige-200">
            <h3 className="text-sm font-bold text-beige-600 uppercase tracking-wider mb-4">About the Seller</h3>
            <div className="flex items-center justify-between bg-beige-50 p-4 rounded-xl border border-beige-200">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${product.sellerId._id}`}>
                  <img 
                    src={product.sellerId.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580220268/avatar.png'} 
                    alt={product.sellerId.name} 
                    className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${product.sellerId._id}`} className="font-bold text-lg text-charcoal hover:text-teal-700 transition-colors">
                    {product.sellerId.name}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-beige-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning" /> {product.sellerId.ratingAvg?.toFixed(1) || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {product.location}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isOwner && (
                <button 
                  onClick={handleMessage}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Seller
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
