import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import SafeImage from '../../components/SafeImage';

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
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/profile')}
          className="mr-4 p-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-dark-surface hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Edit Profile</h1>
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          
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
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 sm:pb-8 border-b border-slate-200 dark:border-dark-border">
            <div className="relative group">
              <SafeImage 
                src={avatarPreview} 
                alt="Avatar" 
                variant="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Picture</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Upload a professional photo to build trust in the community.
                <br/> Max size: 5MB.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6 pb-6 sm:pb-8 border-b border-slate-200 dark:border-dark-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell the community about yourself, your experience, or what you're looking for..."
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white resize-none"
              ></textarea>
            </div>
          </div>

          {/* Location & Skills */}
          <div className="space-y-6 pb-6 sm:pb-8 border-b border-slate-200 dark:border-dark-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Location & Expertise</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Plumbing, Graphic Design, Tutoring, Carpentry"
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-70"
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
