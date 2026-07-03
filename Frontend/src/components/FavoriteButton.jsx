import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ itemId, itemType, className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const checkFav = async () => {
        try {
          const res = await api.get(`/favorites/check/${itemType}/${itemId}`);
          setIsFavorite(res.data.data.isFavorite);
        } catch (err) {
          console.error('Failed to check favorite status', err);
        }
      };
      checkFav();
    }
  }, [user, itemId, itemType]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/favorites/toggle', { itemId, itemType });
      setIsFavorite(res.data.data.isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-sm shadow-sm transition-all ${
        isFavorite 
          ? 'bg-danger/10 text-danger hover:bg-danger/20' 
          : 'bg-white/80 text-charcoal hover:bg-white hover:text-danger'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`w-5 h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : 'scale-100'} ${loading ? 'animate-pulse' : ''}`} 
      />
    </button>
  );
};

export default FavoriteButton;
