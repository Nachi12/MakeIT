import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0 to 5
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'md',
  showNumber = true
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-sans">
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-[#0F172A] ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-[#64748B]">
          ({count})
        </span>
      )}
    </div>
  );
};
