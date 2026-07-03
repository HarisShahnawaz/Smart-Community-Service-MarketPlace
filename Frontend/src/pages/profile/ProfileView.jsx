import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Phone, Star, Edit } from 'lucide-react';

const ProfileView = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If no ID is provided, assume viewing own profile
  const isOwnProfile = !id || (currentUser && id === currentUser._id);
  const fetchId = id || (currentUser ? currentUser._id : null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!fetchId) return;
      try {
        setLoading(true);
        // Use the public route if ID is provided, else use private route for own full details
        const url = isOwnProfile ? '/users/profile' : `/users/${fetchId}`;
        const res = await api.get(url);
        setProfile(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [fetchId, isOwnProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center text-danger p-8 bg-danger/10 rounded-xl">
        {error || 'Profile not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 overflow-hidden relative">
        <div className="h-32 bg-teal-600"></div>
        <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-16">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className="w-32 h-32 rounded-full border-4 border-beige-50 object-cover bg-white shadow-sm"
          />
          <div className="flex-1 text-center sm:text-left pt-2">
            <h1 className="text-3xl font-extrabold text-teal-900">{profile.name}</h1>
            <p className="text-beige-600 font-medium">{profile.role === 'admin' ? 'Administrator' : 'Community Member'}</p>
          </div>
          {isOwnProfile && (
            <Link 
              to="/profile/edit"
              className="flex items-center gap-2 bg-beige-200 hover:bg-beige-300 text-charcoal px-4 py-2 rounded-xl transition-colors font-medium text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 p-6">
            <h3 className="text-lg font-bold text-teal-900 mb-4 border-b border-beige-200 pb-2">About</h3>
            
            <div className="space-y-4">
              {profile.location && (profile.location.city || profile.location.country) && (
                <div className="flex items-center text-charcoal gap-3">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>{profile.location.city}{profile.location.city && profile.location.country && ', '}{profile.location.country}</span>
                </div>
              )}
              
              {isOwnProfile && profile.contactNumber && (
                <div className="flex items-center text-charcoal gap-3">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <span>{profile.contactNumber}</span>
                </div>
              )}

              <div className="flex items-center text-charcoal gap-3">
                <Star className="w-5 h-5 text-warning" />
                <span>
                  <strong className="font-bold">{profile.ratingAvg.toFixed(1)}</strong> ({profile.ratingCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 p-6">
            <h3 className="text-lg font-bold text-teal-900 mb-4 border-b border-beige-200 pb-2">Skills</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-beige-600 text-sm">No skills listed yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Bio & Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 p-6">
            <h3 className="text-lg font-bold text-teal-900 mb-4 border-b border-beige-200 pb-2">Bio</h3>
            {profile.bio ? (
              <p className="text-charcoal whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-beige-600 italic">This user hasn't written a bio yet.</p>
            )}
          </div>
          
          {/* Placeholders for future sections */}
          <div className="bg-beige-50 rounded-2xl shadow-sm border border-beige-300 p-6">
            <h3 className="text-lg font-bold text-teal-900 mb-4 border-b border-beige-200 pb-2">Active Listings</h3>
            <p className="text-beige-600 text-sm">Listings will appear here soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
