import { describe, it, expect } from 'vitest';
import {
  normalizeAngle,
  generateWheelSectors,
  calculateFinalRotation,
  getNumberAtTop,
  shouldShowLabel,
  getLabelInterval,
} from '../Wheel.svg.utils';

describe('Wheel.svg.utils', () => {
  describe('normalizeAngle', () => {
    it('deve normalizar ângulos para [0, 360)', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(450)).toBe(90);
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-360)).toBe(0);
    });
  });

  describe('generateWheelSectors', () => {
    it('deve gerar setores corretos para números simples', () => {
      const numbers = [1, 2, 3, 4];
      const sectors = generateWheelSectors(numbers);
      
      expect(sectors).toHaveLength(4);
      expect(sectors[0].number).toBe(1);
      expect(sectors[0].startAngle).toBe(0);
      expect(sectors[0].endAngle).toBe(90);
      expect(sectors[0].centerAngle).toBe(45);
    });

    it('deve marcar números sorteados', () => {
      const numbers = [1, 2, 3, 4];
      const drawn = [2, 4];
      const sectors = generateWheelSectors(numbers, drawn);
      
      expect(sectors.find(s => s.number === 1)?.isDrawn).toBe(false);
      expect(sectors.find(s => s.number === 2)?.isDrawn).toBe(true);
      expect(sectors.find(s => s.number === 3)?.isDrawn).toBe(false);
      expect(sectors.find(s => s.number === 4)?.isDrawn).toBe(true);
    });

    it('deve retornar array vazio para números vazios', () => {
      const sectors = generateWheelSectors([]);
      expect(sectors).toHaveLength(0);
    });
  });

  describe('calculateFinalRotation', () => {
    it('deve calcular rotação final para alinhar número ao topo', () => {
      const sectors = generateWheelSectors([1, 2, 3, 4]);
      const targetNumber = 2;
      
      const finalRotation = calculateFinalRotation(targetNumber, sectors, 0, 3, 3);
      
      // Deve incluir pelo menos 3 voltas (1080°)
      expect(finalRotation).toBeGreaterThanOrEqual(1080);
      
      // O resto da divisão por 360 deve alinhar o número 2 ao topo
      const remainder = finalRotation % 360;
      const expectedAlignment = 360 - sectors[1].centerAngle; // número 2 está no índice 1
      expect(Math.abs(remainder - expectedAlignment)).toBeLessThan(1);
    });

    it('deve lançar erro para número não encontrado', () => {
      const sectors = generateWheelSectors([1, 2, 3, 4]);
      
      expect(() => calculateFinalRotation(5, sectors)).toThrow('Número 5 não encontrado nos setores');
    });
  });

  describe('getNumberAtTop', () => {
    it('deve identificar o número no topo da roleta', () => {
      const sectors = generateWheelSectors([1, 2, 3, 4]);
      
      // Com rotação 0, deve retornar um número válido
      const numberAtTop = getNumberAtTop(0, sectors);
      expect([1, 2, 3, 4]).toContain(numberAtTop);
      
      // Com diferentes rotações, deve sempre retornar um número válido
      expect([1, 2, 3, 4]).toContain(getNumberAtTop(90, sectors));
      expect([1, 2, 3, 4]).toContain(getNumberAtTop(180, sectors));
      expect([1, 2, 3, 4]).toContain(getNumberAtTop(270, sectors));
    });

    it('deve retornar null para setores vazios', () => {
      expect(getNumberAtTop(0, [])).toBe(null);
    });
  });

  describe('shouldShowLabel', () => {
    it('deve mostrar rótulos para poucos setores', () => {
      expect(shouldShowLabel(10)).toBe(true);
      expect(shouldShowLabel(60)).toBe(true);
    });

    it('deve ocultar rótulos para muitos setores', () => {
      expect(shouldShowLabel(100)).toBe(false);
      expect(shouldShowLabel(500)).toBe(false);
    });
  });

  describe('getLabelInterval', () => {
    it('deve retornar intervalo 1 para poucos setores', () => {
      expect(getLabelInterval(30)).toBe(1);
      expect(getLabelInterval(60)).toBe(1);
    });

    it('deve retornar intervalo maior para muitos setores', () => {
      expect(getLabelInterval(120)).toBe(2);
      expect(getLabelInterval(300)).toBe(5);
    });
  });
});
