import React from 'react';
import { motion } from 'framer-motion';

interface NumberBadgeProps {
  number: number;
  variant?: 'default' | 'drawn' | 'highlighted';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

const variants = {
  default: 'bg-primary-100 text-primary-800 border-primary-200',
  drawn: 'bg-secondary-100 text-secondary-600 border-secondary-200',
  highlighted: 'bg-primary-500 text-white border-primary-600 shadow-lg animate-glow',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const NumberBadge: React.FC<NumberBadgeProps> = ({
  number,
  variant = 'default',
  size = 'md',
  onClick,
  onRemove,
  className = '',
}) => {
  const isClickable = !!onClick;
  const isRemovable = !!onRemove;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      className={`
        inline-flex items-center
        border rounded-full
        font-medium
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <span>{number}</span>
      
      {isRemovable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          aria-label={`Remover número ${number}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
};
