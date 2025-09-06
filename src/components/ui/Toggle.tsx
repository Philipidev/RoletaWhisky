import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const sizes = {
  sm: {
    switch: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translateX: 16, // 4 * 4px
  },
  md: {
    switch: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translateX: 20, // 5 * 4px
  },
  lg: {
    switch: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translateX: 28, // 7 * 4px
  },
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  tooltip,
}) => {
  const sizeConfig = sizes[size];

  return (
    <div className="relative group">
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <motion.div
          className={`
            ${sizeConfig.switch}
            rounded-full
            transition-colors duration-200
            focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
            ${checked 
              ? 'bg-primary-500' 
              : 'bg-secondary-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          animate={{
            backgroundColor: checked ? '#ed7418' : '#cbd5e1',
          }}
        >
          <motion.div
            className={`
              ${sizeConfig.thumb}
              bg-white
              rounded-full
              shadow-md
              transform transition-transform duration-200
            `}
            animate={{
              x: checked ? sizeConfig.translateX : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        </motion.div>
      </div>
        {label && (
          <span className={`ml-3 text-sm font-medium text-secondary-700 ${disabled ? 'opacity-50' : ''}`}>
            {label}
          </span>
        )}
      </label>
      
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-secondary-800"></div>
        </div>
      )}
    </div>
  );
};
