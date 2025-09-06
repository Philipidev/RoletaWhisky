import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDrawStore } from '../useDrawStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('useDrawStore', () => {
  beforeEach(() => {
    // Reset store state
    useDrawStore.setState({
      pool: [],
      drawn: [],
      options: { allowRepeats: true },
      isSpinning: false,
      lastDrawn: undefined,
      inputMode: 'quantity',
      quantity: 100,
      ranges: [{ start: 1, end: 100 }],
      currentRotation: 0,
    });
    
    // Clear localStorage mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('setQuantity', () => {
    it('deve gerar pool de números de 1 até N', () => {
      const { setQuantity } = useDrawStore.getState();
      
      setQuantity(5);
      
      const { pool } = useDrawStore.getState();
      expect(pool).toEqual([1, 2, 3, 4, 5]);
    });

    it('deve lançar erro para quantidade inválida', () => {
      const { setQuantity } = useDrawStore.getState();
      
      expect(() => setQuantity(0)).toThrow('Quantidade deve estar entre 1 e 10.000');
      expect(() => setQuantity(10001)).toThrow('Quantidade deve estar entre 1 e 10.000');
    });

    it('deve limpar histórico quando não permite repetição', () => {
      const store = useDrawStore.getState();
      
      // Configurar estado inicial
      store.toggleAllowRepeats(); // allowRepeats = false
      useDrawStore.setState({ drawn: [{ value: 1, at: '2023-01-01T00:00:00Z' }] });
      
      store.setQuantity(5);
      
      const { drawn } = useDrawStore.getState();
      expect(drawn).toEqual([]);
    });
  });

  describe('setRanges', () => {
    it('deve gerar pool único a partir de ranges', () => {
      const { setRanges } = useDrawStore.getState();
      
      const ranges = [
        { start: 1, end: 3 },
        { start: 5, end: 7 },
      ];
      
      setRanges(ranges);
      
      const { pool } = useDrawStore.getState();
      expect(pool).toEqual([1, 2, 3, 5, 6, 7]);
    });

    it('deve mesclar ranges sobrepostos', () => {
      const { setRanges } = useDrawStore.getState();
      
      const ranges = [
        { start: 1, end: 5 },
        { start: 3, end: 8 },
      ];
      
      setRanges(ranges);
      
      const { pool } = useDrawStore.getState();
      expect(pool).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('deve validar ranges', () => {
      const { setRanges } = useDrawStore.getState();
      
      expect(() => setRanges([{ start: 0, end: 5 }])).toThrow('Números devem ser positivos');
      expect(() => setRanges([{ start: 5, end: 3 }])).toThrow('Início do range deve ser menor ou igual ao fim');
    });
  });

  describe('drawOne', () => {
    beforeEach(() => {
      const { setQuantity } = useDrawStore.getState();
      setQuantity(5); // Pool: [1, 2, 3, 4, 5]
    });

    it('deve sortear um número do pool', () => {
      const { drawOne } = useDrawStore.getState();
      
      const drawnNumber = drawOne();
      
      expect(drawnNumber).toBeGreaterThanOrEqual(1);
      expect(drawnNumber).toBeLessThanOrEqual(5);
      
      const { drawn, lastDrawn } = useDrawStore.getState();
      expect(drawn).toHaveLength(1);
      expect(drawn[0].value).toBe(drawnNumber);
      expect(lastDrawn).toBe(drawnNumber);
    });

    it('deve respeitar regra de não repetição', () => {
      const store = useDrawStore.getState();
      
      // Configurar para não permitir repetição
      store.toggleAllowRepeats(); // allowRepeats = false
      
      // Sortear todos os números
      const drawnNumbers = [];
      for (let i = 0; i < 5; i++) {
        const num = store.drawOne();
        if (num) drawnNumbers.push(num);
      }
      
      // Deve ter sorteado 5 números únicos
      expect(drawnNumbers).toHaveLength(5);
      expect(new Set(drawnNumbers).size).toBe(5);
      
      // Próximo sorteio deve retornar null (pool esgotado)
      expect(store.drawOne()).toBe(null);
    });

    it('deve retornar null quando está girando', () => {
      const store = useDrawStore.getState();
      
      store.setSpinning(true);
      
      expect(store.drawOne()).toBe(null);
    });
  });

  describe('removeFromPool', () => {
    it('deve remover número do pool', () => {
      const store = useDrawStore.getState();
      
      store.setQuantity(5); // Pool: [1, 2, 3, 4, 5]
      store.removeFromPool(3);
      
      const { pool } = useDrawStore.getState();
      expect(pool).toEqual([1, 2, 4, 5]);
    });
  });

  describe('toggleAllowRepeats', () => {
    it('deve alternar opção de permitir repetidos', () => {
      const { toggleAllowRepeats } = useDrawStore.getState();
      
      expect(useDrawStore.getState().options.allowRepeats).toBe(true);
      
      toggleAllowRepeats();
      expect(useDrawStore.getState().options.allowRepeats).toBe(false);
      
      toggleAllowRepeats();
      expect(useDrawStore.getState().options.allowRepeats).toBe(true);
    });
  });

  describe('resetAll', () => {
    it('deve resetar todo o estado', () => {
      const store = useDrawStore.getState();
      
      // Modificar estado
      store.setQuantity(10);
      store.drawOne();
      store.setSpinning(true);
      
      // Reset
      store.resetAll();
      
      const state = useDrawStore.getState();
      expect(state.pool).toEqual([]);
      expect(state.drawn).toEqual([]);
      expect(state.isSpinning).toBe(false);
      expect(state.lastDrawn).toBeUndefined();
    });
  });

  describe('clearHistoryOnly', () => {
    it('deve limpar apenas o histórico', () => {
      const store = useDrawStore.getState();
      
      store.setQuantity(5);
      store.drawOne();
      
      const poolBefore = [...useDrawStore.getState().pool];
      
      store.clearHistoryOnly();
      
      const state = useDrawStore.getState();
      expect(state.drawn).toEqual([]);
      expect(state.lastDrawn).toBeUndefined();
      expect(state.pool).toEqual(poolBefore); // Pool deve permanecer
    });
  });
});
