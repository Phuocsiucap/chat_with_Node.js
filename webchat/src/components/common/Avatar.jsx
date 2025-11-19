import React from 'react';
import { getFullUrl } from '../../services/api';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const fullSrc = getFullUrl(src);

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${className}`}>
      {fullSrc ? (
        <img
          src={fullSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
