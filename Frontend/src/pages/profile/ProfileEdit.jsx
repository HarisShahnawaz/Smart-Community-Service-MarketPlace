import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, ArrowLeft } from 'lucide-react';

const ProfileEdit = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    contactNumber: '',
    city: '',
    country: '',
    skills: '', // string for form input
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const profile = res.data.data;
        setFormData({
          name: profile.name || '',
          bio: profile.bio || '',
          contactNumber: profile.contactNumber || '',
          city: profile.location?.city || '',
          country: profile.location?.country || '',
          skills: profile.skills ? profile.skills.join(', ') : '',
        });
        setAvatarPreview(profile.avatar);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('contactNumber', formData.contactNumber);
      data.append('city', formData.city);
      data.append('country', formData.country);
      data.append('skills', formData.skills);
      
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      await api.put('/users/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
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
        <button 
          onClick={() => navigate('/profile')}
          className="mr-4 p-2 text-beige-600 hover:text-teal-600 bg-beige-200 hover:bg-teal-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold text-teal-900">Edit Profile</h1>
      </div>

      <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-beige-200">
            <div className="relative group">
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-beige-100 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-teal-900/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Change</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-teal-900">Profile Picture</h3>
              <p className="text-sm text-beige-600 mt-1">
                Upload a professional photo to build trust in the community.
                <br/> Max size: 5MB.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6 pb-8 border-b border-beige-200">
            <h3 className="text-lg font-bold text-teal-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell the community about yourself, your experience, or what you're looking for..."
                className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal resize-none"
              ></textarea>
            </div>
          </div>

          {/* Location & Skills */}
          <div className="space-y-6 pb-8 border-b border-beige-200">
            <h3 className="text-lg font-bold text-teal-900">Location & Expertise</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Plumbing, Graphic Design, Tutoring, Carpentry"
                className="w-full px-4 py-2.5 border border-beige-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-charcoal"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 border border-beige-300 text-charcoal rounded-xl hover:bg-beige-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-70"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
