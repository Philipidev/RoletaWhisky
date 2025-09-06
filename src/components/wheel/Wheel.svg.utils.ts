import type { WheelSector } from '../../lib/types';

/**
 * Converte graus para radianos
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converte radianos para graus
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normaliza um ângulo para o intervalo [0, 360)
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Gera um arco SVG usando path
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  // Calcular a diferença de ângulo corretamente, considerando setores que cruzam 0°
  let angleDiff = endAngle - startAngle;
  
  // Se a diferença for negativa, significa que o setor cruza 0°
  if (angleDiff < 0) {
    angleDiff = 360 + angleDiff;
  }
  
  // Para ângulos muito pequenos, usar uma aproximação com linhas
  if (angleDiff < 0.1) {
    // Para ângulos muito pequenos, criar um triângulo simples
    const midAngle = startAngle + angleDiff / 2;
    const midPoint = polarToCartesian(cx, cy, radius, midAngle);
    return [
      'M', cx, cy,
      'L', midPoint.x, midPoint.y,
      'L', cx, cy,
      'Z'
    ].join(' ');
  }
  
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  
  const largeArcFlag = angleDiff <= 180 ? '0' : '1';
  
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

/**
 * Converte coordenadas polares para cartesianas
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = degreesToRadians(angleInDegrees - 90);
  
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

/**
 * Gera setores da roleta baseado nos números disponíveis
 */
export function generateWheelSectors(
  numbers: number[],
  drawnNumbers: number[] = []
): WheelSector[] {
  if (numbers.length === 0) return [];
  
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const anglePerSector = 360 / sortedNumbers.length;
  
  return sortedNumbers.map((number, index) => {
    const startAngle = index * anglePerSector;
    const endAngle = startAngle + anglePerSector;
    const centerAngle = startAngle + (anglePerSector / 2);
    
    return {
      number,
      startAngle: normalizeAngle(startAngle),
      endAngle: normalizeAngle(endAngle),
      centerAngle: normalizeAngle(centerAngle),
      isDrawn: drawnNumbers.includes(number)
    };
  });
}

/**
 * Calcula a rotação final para alinhar um número específico ao ponteiro (topo)
 */
export function calculateFinalRotation(
  targetNumber: number,
  sectors: WheelSector[],
  currentRotation: number = 0,
  minSpins: number = 3,
  maxSpins: number = 6
): number {
  const targetSector = sectors.find(sector => sector.number === targetNumber);
  if (!targetSector) {
    throw new Error(`Número ${targetNumber} não encontrado nos setores`);
  }
  
  // Normalizar a rotação atual para calcular a posição relativa
  const currentNormalizedRotation = normalizeAngle(-currentRotation);
  
  // Ângulo do setor alvo
  const targetSectorAngle = targetSector.centerAngle;
  
  // Calcular a diferença angular necessária (quanto precisamos rotacionar)
  let angleDifference = currentNormalizedRotation - targetSectorAngle;
  
  // Se a diferença for negativa, adicionar 360° para ir na direção positiva
  if (angleDifference < 0) {
    angleDifference += 360;
  }
  
  // Número aleatório de voltas completas
  const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
  const fullRotations = spins * 360;
  
  // Rotação final = rotação atual + voltas completas + diferença angular
  const finalRotation = currentRotation + fullRotations + angleDifference;
  
  return finalRotation;
}

/**
 * Calcula qual número está atualmente no topo da roleta
 */
export function getNumberAtTop(
  currentRotation: number,
  sectors: WheelSector[]
): number | null {
  if (sectors.length === 0) return null;
  
  // Normalizar a rotação atual
  const normalizedRotation = normalizeAngle(-currentRotation);
  
  // Encontrar o setor que contém o ângulo 0° (topo)
  const targetSector = sectors.find(sector => {
    const start = sector.startAngle;
    const end = sector.endAngle;
    
    // Lidar com setores que cruzam 0°
    if (start > end) {
      return normalizedRotation >= start || normalizedRotation <= end;
    } else {
      return normalizedRotation >= start && normalizedRotation <= end;
    }
  });
  
  return targetSector?.number ?? null;
}

/**
 * Calcula a posição do texto em um setor
 */
export function getTextPosition(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
  offset: number = 0.7
): { x: number; y: number } {
  return polarToCartesian(cx, cy, radius * offset, angle);
}

/**
 * Determina se deve mostrar o rótulo baseado na densidade de setores
 */
export function shouldShowLabel(
  totalSectors: number,
  maxVisibleLabels: number = 60
): boolean {
  return totalSectors <= maxVisibleLabels;
}

/**
 * Calcula o intervalo de rótulos a serem mostrados quando há muitos setores
 */
export function getLabelInterval(
  totalSectors: number,
  maxVisibleLabels: number = 60
): number {
  if (totalSectors <= maxVisibleLabels) return 1;
  return Math.ceil(totalSectors / maxVisibleLabels);
}

/**
 * Gera cores alternadas para os setores
 */
export function getSectorColor(
  index: number,
  isDrawn: boolean = false,
  primaryColor: string = '#f19340',
  secondaryColor: string = '#ed7418',
  drawnColor: string = '#94a3b8'
): string {
  if (isDrawn) return drawnColor;
  return index % 2 === 0 ? primaryColor : secondaryColor;
}

/**
 * Calcula o tamanho da fonte baseado no número de setores
 */
export function getFontSize(totalSectors: number): number {
  if (totalSectors <= 10) return 16;
  if (totalSectors <= 20) return 14;
  if (totalSectors <= 50) return 12;
  if (totalSectors <= 100) return 10;
  return 8;
}
