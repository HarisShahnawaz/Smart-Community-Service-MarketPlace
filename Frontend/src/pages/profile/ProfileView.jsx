import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Phone, Star, Edit, Calendar, Package, Briefcase } from 'lucide-react';

// ─── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut', delay },
});

const ProfileView = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = !id || (currentUser && id === currentUser._id);
  const fetchId = id || (currentUser ? currentUser._id : null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!fetchId) return;
      try {
        setLoading(true);
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
        <div className="w-10 h-10 border-4 border-brand-200 dark:border-dark-surface border-t-brand-600 dark:border-t-dark-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/40">
        {error || 'Profile not found'}
      </div>
    );
  }

  // Derived stats for the stat bar
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Profile Hero Card ── */}
      <motion.div
        {...fadeUp(0)}
        className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden"
      >
        {/* Banner */}
        <div className="h-36 bg-gradient-to-br from-brand-600 via-brand-700 to-teal-800 relative">
          {/* Subtle radial pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row gap-5 items-center sm:items-end -mt-14 relative z-10">
          {/* Avatar */}
          <motion.img
            {...fadeUp(0.1)}
            src={profile.avatar}
            alt={profile.name}
            className="w-28 h-28 rounded-full border-4 border-white dark:border-dark-surface ring-2 ring-brand-200 dark:ring-brand-700 object-cover bg-white shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left pb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-dark-text-primary">
              {profile.name}
            </h1>
            <p className="text-slate-500 dark:text-dark-text-secondary text-sm font-medium mt-0.5">
              {profile.role === 'admin' ? 'Administrator' : 'Community Member'}
            </p>

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-dark-text-secondary text-xs font-medium px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                {profile.ratingAvg?.toFixed(1)} ({profile.ratingCount} reviews)
              </span>
              {profile.location && (profile.location.city || profile.location.country) && (
                <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-dark-text-secondary text-xs font-medium px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {profile.location.city}
                  {profile.location.city && profile.location.country && ', '}
                  {profile.location.country}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-dark-text-secondary text-xs font-medium px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Member since {memberSince}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <motion.div whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 dark:bg-dark-brand dark:hover:bg-dark-brand-hover text-white dark:text-dark-bg px-4 py-2.5 rounded-xl transition-colors font-medium text-sm shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Body Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — About & Skills */}
        <div className="space-y-5">
          {/* Contact info */}
          <motion.div
            {...fadeUp(0.1)}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-4">
              About
            </h3>
            <div className="space-y-3">
              {isOwnProfile && profile.contactNumber && (
                <div className="flex items-center text-slate-700 dark:text-dark-text-primary gap-3 text-sm">
                  <div className="w-8 h-8 bg-brand-50 dark:bg-dark-bg rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-brand-600 dark:text-dark-brand" />
                  </div>
                  {profile.contactNumber}
                </div>
              )}
              <div className="flex items-center text-slate-700 dark:text-dark-text-primary gap-3 text-sm">
                <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <span>
                  <strong className="font-bold">{profile.ratingAvg?.toFixed(1)}</strong>
                  <span className="text-slate-500 dark:text-dark-text-secondary"> ({profile.ratingCount} reviews)</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            {...fadeUp(0.18)}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-4">
              Skills
            </h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-brand-50 dark:bg-dark-bg text-brand-700 dark:text-dark-brand px-3 py-1 rounded-full text-sm font-medium border border-brand-200 dark:border-dark-brand/30 cursor-default transition-colors hover:bg-brand-100 dark:hover:bg-dark-brand/10"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-dark-text-secondary text-sm italic">No skills listed yet.</p>
            )}
          </motion.div>
        </div>

        {/* Right — Bio & Listings */}
        <div className="md:col-span-2 space-y-5">
          {/* Bio */}
          <motion.div
            {...fadeUp(0.14)}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-4">
              Bio
            </h3>
            {profile.bio ? (
              <p className="text-slate-700 dark:text-dark-text-primary whitespace-pre-wrap leading-relaxed text-sm">
                {profile.bio}
              </p>
            ) : (
              <p className="text-slate-400 dark:text-dark-text-secondary italic text-sm">
                {isOwnProfile
                  ? "You haven't written a bio yet. "
                  : "This user hasn't written a bio yet."}
                {isOwnProfile && (
                  <Link to="/profile/edit" className="text-brand-600 dark:text-dark-brand hover:underline not-italic font-medium">
                    Add one now →
                  </Link>
                )}
              </p>
            )}
          </motion.div>

          {/* Listings placeholder — styled, not bare */}
          <motion.div
            {...fadeUp(0.22)}
            className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-dark-text-secondary mb-5">
              Active Listings
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/profile?tab=products"
                className="group flex-1 flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-bg hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-slate-100 dark:border-dark-border hover:border-teal-200 dark:hover:border-teal-700 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-teal-600 dark:text-dark-brand" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-dark-text-primary text-sm group-hover:text-teal-700 dark:group-hover:text-dark-brand transition-colors">
                    Products
                  </p>
                  <p className="text-xs text-slate-500 dark:text-dark-text-secondary">View all listed items</p>
                </div>
              </Link>
              <Link
                to="/profile?tab=services"
                className="group flex-1 flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-bg hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-100 dark:border-dark-border hover:border-purple-200 dark:hover:border-purple-700 rounded-xl transition-all"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-dark-text-primary text-sm group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                    Services
                  </p>
                  <p className="text-xs text-slate-500 dark:text-dark-text-secondary">View all offered services</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
