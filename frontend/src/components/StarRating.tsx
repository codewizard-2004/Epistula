"use client";
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  onRatingChange: (rating: number) => void;
  initialRating?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  onRatingChange, 
  initialRating = 0, 
  disabled = false,
  size = 'md'
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starRating: number) => {
    if (disabled) return;
    setRating(starRating);
    onRatingChange(starRating);
  };

  const handleStarHover = (starRating: number) => {
    if (disabled) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverRating(0);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors duration-200 ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-300'
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
}
