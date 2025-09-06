import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useDrawStore, useDrawnNumbers } from '../../store/useDrawStore';
import { Pointer } from './Pointer';
import CentroImagemRoleta from '../../assets/CentroImagemRoleta.png';
import {
  generateWheelSectors,
  describeArc,
  getTextPosition,
  getLabelInterval,
  getSectorColor,
  getFontSize,
  calculateFinalRotation,
  polarToCartesian,
} from './Wheel.svg.utils';

// Constante para controlar o tamanho da imagem central (proporção do raio)
const CENTER_IMAGE_SCALE = 0.90;

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
  
  const radius = size / 2 - 50; // Margem para acomodar borda grossa e botões
  const center = size / 2;
  const centerImageSize = Math.max(80, radius * CENTER_IMAGE_SCALE); // Tamanho da imagem proporcional ao raio
  
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
              '#ef0408',
              '#492419',
              '#e6aa5e'
            );
            
            // Determinar cor do texto baseada no fundo
            const textColor = sector.isDrawn ? '#6b7280' : 
              (index % 2 === 0 ? '#fbe3cb' : '#e6aa5e');
            
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
                    fill={textColor}
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
        
        {/* Borda externa com gradiente e botões decorativos */}
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b8941f" />
            <stop offset="25%" stopColor="#efb95d" />
            <stop offset="50%" stopColor="#ffe4ab" />
            <stop offset="75%" stopColor="#efb95d" />
            <stop offset="100%" stopColor="#d4a853" />
          </linearGradient>
          <radialGradient id="buttonGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffe4ab" />
            <stop offset="70%" stopColor="#efb95d" />
            <stop offset="100%" stopColor="#d4a853" />
          </radialGradient>
        </defs>
        
        {/* Borda principal mais larga */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="40"
        />
        
        {/* 13 botões decorativos ao redor da borda */}
        {Array.from({ length: 13 }, (_, i) => {
          const angle = (i * 360) / 13;
          const buttonRadius = radius + 9;
          const buttonPos = polarToCartesian(center, center, buttonRadius, angle);
          
          return (
            <g key={`button-${i}`}>
              {/* Sombra do botão */}
              <circle
                cx={buttonPos.x +3}
                cy={buttonPos.y + 3}
                r="10"
                fill="rgba(0,0,0,0.3)"
              />
              {/* Botão principal */}
              <circle
                cx={buttonPos.x}
                cy={buttonPos.y}
                r="10"
                fill="url(#buttonGradient)"
                stroke="#d4a853"
                strokeWidth="3"
              />
              {/* Detalhe central do botão */}
              <circle
                cx={buttonPos.x}
                cy={buttonPos.y}
                r="5"
                fill="#b8941f"
              />
            </g>
          );
        })}
        
        {/* Centro da roleta */}
        {/* Fundo quadrado do centro */}
        <rect
          x={center - centerImageSize / 2}
          y={center - centerImageSize / 2}
          width={centerImageSize}
          height={centerImageSize}
          fill="#7e4b23"
          stroke="#6b3e1f"
          strokeWidth="3"
          rx="8"
          ry="8"
        />
        
        {/* Imagem quadrada do centro */}
        <foreignObject
          x={center - centerImageSize / 2 + 3}
          y={center - centerImageSize / 2 + 3}
          width={centerImageSize - 6}
          height={centerImageSize - 6}
        >
          <img
            src={CentroImagemRoleta}
            alt="Logan Heritage Blend"
            style={{
              width: `${centerImageSize - 6}px`,
              height: `${centerImageSize - 6}px`,
              objectFit: 'cover',
              borderRadius: '5px'
            }}
          />
        </foreignObject>
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
    
    </div>
  );
});
