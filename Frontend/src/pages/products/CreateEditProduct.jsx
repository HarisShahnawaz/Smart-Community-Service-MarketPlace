import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Upload, X, ArrowLeft, Save } from 'lucide-react';

const CreateEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    location: '',
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = [
    'Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Sports', 'Other'
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const product = res.data.data;
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            location: product.location,
          });
          setExistingImages(product.images || []);
        } catch (err) {
          setError('Failed to load product details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total limit (existing + new)
    if (existingImages.length + newImages.length + files.length > 5) {
      alert('You can only upload up to 5 images total.');
      return;
    }

    setNewImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('location', formData.location);

      newImages.forEach(file => {
        data.append('images', file);
      });

      if (isEditMode) {
        await api.put(`/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          to={isEditMode ? `/products/${id}` : "/products"}
          className="mr-4 p-2 text-beige-600 hover:text-teal-600 bg-beige-200 hover:bg-teal-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-teal-900">
          {isEditMode ? 'Edit Product' : 'Sell an Item'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-300 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Title & Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-charcoal mb-1">Product Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                placeholder="e.g., iPhone 13 Pro Max - 256GB"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors font-mono"
              />
            </div>
          </div>

          {/* Category, Condition, Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
              >
                <option value="" disabled>Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Downtown, NY"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              maxLength="1000"
              placeholder="Describe your item in detail..."
              className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors resize-none"
            ></textarea>
            <div className="text-right text-xs text-beige-600 mt-1">
              {formData.description.length}/1000 characters
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-charcoal mb-2">
              Photos (Max 5)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {/* Existing Images (Edit mode) */}
              {existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-beige-300 group">
                  <img src={url} alt="Existing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Uploaded</span>
                  </div>
                </div>
              ))}
              
              {/* New Image Previews */}
              {previews.map((preview, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-teal-500 group">
                  <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-teal-600/80 text-white text-[10px] text-center py-0.5">
                    New
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              {(existingImages.length + newImages.length) < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-beige-400 hover:border-teal-500 hover:bg-teal-50 cursor-pointer flex flex-col items-center justify-center text-beige-600 hover:text-teal-600 transition-colors">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-beige-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto sm:min-w-[200px] flex items-center justify-center ml-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 shadow-sm"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isEditMode ? 'Save Changes' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditProduct;
