import React from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface StarRatingProps {
  bookingCount: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Calcule le nombre d'étoiles basé sur le nombre de réservations
 * 0-2 réservations   → 1 étoile
 * 3-5 réservations   → 2 étoiles
 * 6-10 réservations  → 3 étoiles
 * 11-20 réservations → 4 étoiles
 * 21+ réservations   → 5 étoiles
 */
const calculateStars = (bookingCount: number): number => {
  if (bookingCount === 0) return 0;
  if (bookingCount <= 2) return 1;
  if (bookingCount <= 5) return 2;
  if (bookingCount <= 10) return 3;
  if (bookingCount <= 20) return 4;
  return 5;
};

const StarRating: React.FC<StarRatingProps> = ({ bookingCount, showCount = false, size = 'md' }) => {
  const stars = calculateStars(bookingCount);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderStars = () => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - Math.ceil(stars);

    return (
      <div className="flex items-center gap-0.5">
        {/* Étoiles pleines */}
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        
        {/* Demi-étoile */}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        
        {/* Étoiles vides */}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  if (bookingCount === 0) {
    return (
      <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <FaRegStar key={i} className="text-gray-300" />
          ))}
        </div>
        {showCount && (
          <span className="text-xs text-gray-500">(Nouveau)</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {renderStars()}
      {showCount && (
        <span className="text-xs text-gray-600">
          ({bookingCount} {bookingCount === 1 ? 'réservation' : 'réservations'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
