import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useDrawStore, useDrawnNumbers } from '../../store/useDrawStore';
import { Pointer } from './Pointer';
import {
  generateWheelSectors,
  describeArc,
  getTextPosition,
  getLabelInterval,
  getSectorColor,
  getFontSize,
  calculateFinalRotation,
} from './Wheel.svg.utils';

interface WheelProps {
  size?: number;
  showNumbers?: boolean;
  fontSize?: number;
  onSpinComplete?: (number: number) => void;
}

export interface WheelRef {
  spin: () => void;
}

export const Wheel = forwardRef<WheelRef, WheelProps>(({
  size = 400,
  showNumbers = true,
  fontSize = 16,
  onSpinComplete,
}, ref) => {
  const {
    pool,
    isSpinning,
    currentRotation,
    setCurrentRotation,
    setSpinning,
    drawOne,
    confirmDraw,
  } = useDrawStore();
  
  const drawnNumbers = useDrawnNumbers();
  const wheelRef = useRef<SVGGElement>(null);
  
  const radius = size / 2 - 20; // Margem para o ponteiro
  const center = size / 2;
  
  // Gerar setores da roleta
  const sectors = useMemo(() => {
    return generateWheelSectors(pool, drawnNumbers);
  }, [pool, drawnNumbers]);
  
  // Configurações de exibição baseadas no número de setores e props
  const showLabels = showNumbers; // Sempre mostrar quando showNumbers=true
  const labelInterval = showNumbers ? 1 : getLabelInterval(sectors.length); // Mostrar todos quando controlado manualmente
  const dynamicFontSize = showNumbers ? fontSize : getFontSize(sectors.length);
  
  // Função para girar a roleta
  const spin = async () => {
    if (isSpinning || sectors.length === 0) return;
    
    // Sortear número ANTES de marcar como spinning
    const drawnNumber = drawOne();
    if (!drawnNumber) {
      return;
    }
    
    // Agora marcar como spinning
    setSpinning(true);
    
    // Calcular rotação final
    const finalRotation = calculateFinalRotation(
      drawnNumber,
      sectors,
      currentRotation
    );
    
    // Animar rotação
    setCurrentRotation(finalRotation);
    
    // Aguardar animação completar
    setTimeout(() => {
      setSpinning(false);
      confirmDraw(); // Confirmar o número no histórico após a animação
      onSpinComplete?.(drawnNumber);
    }, 3000);
  };
  
  // Expor a função spin via ref
  useImperativeHandle(ref, () => ({
    spin
  }));
  
  if (sectors.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-secondary-100 rounded-full border-4 border-secondary-200"
        style={{ width: size, height: size }}
      >
        <p className="text-secondary-500 text-center px-4">
          Configure os números para começar
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Ponteiro */}
      <Pointer isActive={isSpinning} />
      
      {/* Roleta */}
      <motion.svg
        width={size}
        height={size}
        className="drop-shadow-lg cursor-pointer"
        onClick={spin}
        whileHover={!isSpinning ? { scale: 1.02 } : {}}
      >
        <motion.g
          ref={wheelRef}
          style={{ 
            transformOrigin: `${center}px ${center}px`,
          }}
          animate={{ rotate: currentRotation }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: isSpinning ? [0.25, 0.46, 0.45, 0.94] : 'linear',
          }}
        >
          {/* Setores */}
          {sectors.map((sector, index) => {
            const sectorPath = describeArc(
              center,
              center,
              radius,
              sector.startAngle,
              sector.endAngle
            );
            
            const textPosition = getTextPosition(
              center,
              center,
              radius,
              sector.centerAngle,
              0.7
            );
            
            const sectorColor = getSectorColor(
              index,
              sector.isDrawn,
              '#f19340',
              '#ed7418',
              '#94a3b8'
            );
            
            return (
              <g key={sector.number}>
                {/* Setor */}
                <path
                  d={sectorPath}
                  fill={sectorColor}
                  stroke="#fff"
                  strokeWidth="2"
                  className={`
                    transition-opacity duration-300
                    ${sector.isDrawn ? 'opacity-60' : 'opacity-100'}
                  `}
                />
                
                {/* Rótulo do número */}
                {showLabels && index % labelInterval === 0 && (
                  <text
                    x={textPosition.x}
                    y={textPosition.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={dynamicFontSize}
                    fontWeight="bold"
                    fill={sector.isDrawn ? '#6b7280' : '#fff'}
                    className="pointer-events-none select-none"
                    transform={`rotate(${sector.centerAngle}, ${textPosition.x}, ${textPosition.y})`}
                  >
                    {sector.number}
                  </text>
                )}
              </g>
            );
          })}
        </motion.g>
        
        {/* Borda externa */}
        <circle
          cx={center}
          cy={center}
          r={radius + 2}
          fill="none"
          stroke="#334155"
          strokeWidth="4"
        />
        
        {/* Centro da roleta */}
        <circle
          cx={center}
          cy={center}
          r="12"
          fill="#334155"
          stroke="#fff"
          strokeWidth="2"
        />
      </motion.svg>
      
      {/* Efeito de blur durante o giro */}
      {isSpinning && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-10 rounded-full pointer-events-none"
          style={{
            backdropFilter: 'blur(1px)',
          }}
        />
      )}
      
      {/* Instruções */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-secondary-600 text-center">
          {isSpinning ? 'Girando...' : 'Clique para girar'}
        </p>
      </div>
    </div>
  );
});
