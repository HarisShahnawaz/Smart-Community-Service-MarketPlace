/**
 * SafeImage.jsx
 * Drop-in replacement for <img> that silently falls back to a local
 * placeholder if the remote URL fails to load (404, CORS error, etc.).
 *
 * Usage:
 *   import SafeImage from '../components/SafeImage';
 *
 *   // Product/service image (landscape placeholder)
 *   <SafeImage src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
 *
 *   // User avatar (circular placeholder)
 *   <SafeImage src={user.avatar} alt={user.name} variant="avatar" className="w-8 h-8 rounded-full" />
 */

const PLACEHOLDER_IMAGE  = '/placeholder-image.svg';
const PLACEHOLDER_AVATAR = '/placeholder-avatar.svg';

const SafeImage = ({ src, alt = '', variant = 'image', className = '', ...rest }) => {
  const fallback = variant === 'avatar' ? PLACEHOLDER_AVATAR : PLACEHOLDER_IMAGE;

  const handleError = (e) => {
    // Prevent infinite loop if the placeholder itself fails
    e.target.onerror = null;
    e.target.src = fallback;
  };

  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
};

export default SafeImage;
