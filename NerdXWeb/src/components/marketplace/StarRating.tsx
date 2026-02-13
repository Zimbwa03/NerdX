import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onChange,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.floor(displayRating);
          const half = !filled && starValue - 0.5 <= displayRating;

          return (
            <button
              key={i}
              type="button"
              className={`star-rating__star${filled ? ' star-rating__star--filled' : ''}${half ? ' star-rating__star--half' : ''}${interactive ? ' star-rating__star--interactive' : ''}`}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star size={size} />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="star-rating__value">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="star-rating__count">({reviewCount})</span>
      )}
    </div>
  );
}
