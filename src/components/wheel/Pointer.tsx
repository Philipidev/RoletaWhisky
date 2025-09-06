import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  size?: number;
  color?: string;
  isActive?: boolean;
}

export const Pointer: React.FC<PointerProps> = ({
  size = 100,
  isActive = false,
}) => {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 z-10"
      style={{ top: '-55px', left: '45%' }}
      animate={isActive ? {
        scale: [1, 1.3, 1],
        rotate: [0, -8, 8, 0],
      } : {}}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 50 75"
        className="drop-shadow-xl"
        style={{ transform: 'rotate(180deg)' }}
      >
        <defs>
          <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a0622d" />
            <stop offset="30%" stopColor="#8b5426" />
            <stop offset="70%" stopColor="#7e4b23" />
            <stop offset="100%" stopColor="#7e4b23" />
          </linearGradient>
        </defs>
        
        {/* Sombra do ponteiro */}
        <path
          d="M25 4 L40 40 L25 34 L10 40 Z"
          fill="rgba(0, 0, 0, 0.3)"
          transform="translate(3, 3)"
        />
        
        {/* Ponteiro principal */}
        <path
          d="M25 4 L40 40 L25 34 L10 40 Z"
          fill="url(#pointerGradient)"
          stroke="#6b3e1f"
          strokeWidth="3"
        />
        
        {/* Destaque no ponteiro */}
        <path
          d="M25 4 L33 25 L25 22 L17 25 Z"
          fill="rgba(255, 255, 255, 0.4)"
        />
        
        {/* Base circular maior */}
        <circle
          cx="25"
          cy="40"
          r="10"
          fill="url(#pointerGradient)"
          stroke="#6b3e1f"
          strokeWidth="3"
        />
        
        {/* Anel interno da base */}
        <circle
          cx="25"
          cy="40"
          r="6"
          fill="none"
          stroke="#5a3318"
          strokeWidth="2"
        />
        
        {/* Destaque na base */}
        <circle
          cx="25"
          cy="40"
          r="3.5"
          fill="rgba(255, 255, 255, 0.3)"
        />
      </svg>
    </motion.div>
  );
};
