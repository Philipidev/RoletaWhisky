import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  size?: number;
  color?: string;
  isActive?: boolean;
}

export const Pointer: React.FC<PointerProps> = ({
  size = 20,
  color = '#ed7418',
  isActive = false,
}) => {
  return (
    <motion.div
      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      animate={isActive ? {
        scale: [1, 1.2, 1],
        rotate: [0, -5, 5, 0],
      } : {}}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 20 30"
        className="drop-shadow-lg"
      >
        {/* Sombra do ponteiro */}
        <path
          d="M10 2 L18 18 L10 15 L2 18 Z"
          fill="rgba(0, 0, 0, 0.2)"
          transform="translate(1, 1)"
        />
        
        {/* Ponteiro principal */}
        <path
          d="M10 2 L18 18 L10 15 L2 18 Z"
          fill={color}
          stroke="#fff"
          strokeWidth="1"
        />
        
        {/* Destaque no ponteiro */}
        <path
          d="M10 2 L14 12 L10 10 L6 12 Z"
          fill="rgba(255, 255, 255, 0.3)"
        />
        
        {/* Base circular */}
        <circle
          cx="10"
          cy="18"
          r="4"
          fill={color}
          stroke="#fff"
          strokeWidth="1"
        />
        
        {/* Destaque na base */}
        <circle
          cx="10"
          cy="18"
          r="2"
          fill="rgba(255, 255, 255, 0.4)"
        />
      </svg>
    </motion.div>
  );
};
