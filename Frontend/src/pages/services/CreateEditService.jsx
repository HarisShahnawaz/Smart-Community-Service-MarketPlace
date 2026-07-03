import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Upload, X, ArrowLeft, Save } from 'lucide-react';

const CreateEditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryTimeInDays: '',
    category: '',
    availability: true,
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = [
    'Web Development', 'Graphic Design', 'Tutoring', 'Home Repair', 'Cleaning', 'Photography', 'Writing', 'Other'
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchService = async () => {
        try {
          const res = await api.get(`/services/${id}`);
          const service = res.data.data;
          setFormData({
            title: service.title,
            description: service.description,
            price: service.price,
            deliveryTimeInDays: service.deliveryTimeInDays,
            category: service.category,
            availability: service.availability,
          });
          setExistingImages(service.portfolioImages || []);
        } catch (err) {
          setError('Failed to load service details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (existingImages.length + newImages.length + files.length > 5) {
      alert('You can only upload up to 5 portfolio images total.');
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
      data.append('deliveryTimeInDays', formData.deliveryTimeInDays);
      data.append('category', formData.category);
      data.append('availability', formData.availability);

      newImages.forEach(file => {
        data.append('images', file);
      });

      if (isEditMode) {
        await api.put(`/services/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/services', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
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
          to={isEditMode ? `/services/${id}` : "/services"}
          className="mr-4 p-2 text-beige-600 hover:text-teal-600 bg-beige-200 hover:bg-teal-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold text-teal-900">
          {isEditMode ? 'Edit Service' : 'Offer a New Service'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-300 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Service Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="100"
              placeholder="e.g., Professional Plumbing Repairs"
              className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Starting Price ($)</label>
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
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Delivery Time (Days)</label>
              <input
                type="number"
                name="deliveryTimeInDays"
                value={formData.deliveryTimeInDays}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 3"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors"
              />
            </div>
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
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              maxLength="2000"
              placeholder="Describe your service, what's included, and why they should hire you..."
              className="w-full px-4 py-3 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-beige-50 text-charcoal transition-colors resize-none"
            ></textarea>
            <div className="text-right text-xs text-beige-600 mt-1">
              {formData.description.length}/2000 characters
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 p-4 bg-beige-50 border border-beige-200 rounded-xl">
            <input
              type="checkbox"
              id="availability"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="w-5 h-5 text-teal-600 border-beige-400 rounded focus:ring-teal-500 cursor-pointer"
            />
            <label htmlFor="availability" className="font-medium text-charcoal cursor-pointer">
              I am currently available to take orders for this service.
            </label>
          </div>

          {/* Portfolio Images */}
          <div>
            <label className="block text-sm font-bold text-charcoal mb-2">
              Portfolio Images (Max 5)
            </label>
            <p className="text-sm text-beige-600 mb-4">Upload examples of your past work to attract more clients.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-beige-300 group">
                  <img src={url} alt="Existing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Uploaded</span>
                  </div>
                </div>
              ))}
              
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
                </div>
              ))}

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
              {isEditMode ? 'Save Changes' : 'Publish Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditService;
