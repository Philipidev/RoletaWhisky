import { create } from 'zustand';
import type { DrawState, Range, DrawnNumber, InputMode } from '../lib/types';
import { saveDrawState, loadDrawState, clearDrawState, clearHistory } from '../lib/persistence';
import { RNG } from '../lib/rng';

interface DrawStore extends DrawState {
  // Estado adicional da UI
  inputMode: InputMode;
  quantity: number;
  ranges: Range[];
  currentRotation: number;
  pendingDraw: number | null; // Número sorteado mas ainda não confirmado
  
  // Ações para definir números
  setQuantity: (quantity: number) => void;
  setRanges: (ranges: Range[]) => void;
  setInputMode: (mode: InputMode) => void;
  
  // Ações de sorteio
  drawOne: () => number | null;
  confirmDraw: () => void; // Confirma o número pendente no histórico
  setSpinning: (spinning: boolean) => void;
  setCurrentRotation: (rotation: number) => void;
  
  // Ações de gerenciamento
  removeFromPool: (number: number) => void;
  toggleAllowRepeats: () => void;
  resetAll: () => void;
  clearHistoryOnly: () => void;
  
  // Persistência
  hydrate: () => void;
  persist: () => void;
}

// Estado inicial
const initialState = {
  pool: [],
  drawn: [],
  options: {
    allowRepeats: true,
    seed: undefined,
  },
  isSpinning: false,
  lastDrawn: undefined,
  inputMode: 'quantity' as InputMode,
  quantity: 100,
  ranges: [{ start: 1, end: 100 }],
  currentRotation: 0,
  pendingDraw: null,
};

export const useDrawStore = create<DrawStore>((set, get) => ({
  ...initialState,

  setQuantity: (quantity: number) => {
    if (quantity < 1 || quantity > 10000) {
      throw new Error('Quantidade deve estar entre 1 e 10.000');
    }
    
    const pool = Array.from({ length: quantity }, (_, i) => i + 1);
    
    set({ 
      quantity, 
      pool,
      // Limpar números sorteados se não permitir repetição
      drawn: get().options.allowRepeats ? get().drawn : []
    });
    
    get().persist();
  },

  setRanges: (ranges: Range[]) => {
    // Validar ranges
    for (const range of ranges) {
      if (range.start < 1 || range.end < 1) {
        throw new Error('Números devem ser positivos');
      }
      if (range.start > range.end) {
        throw new Error('Início do range deve ser menor ou igual ao fim');
      }
    }
    
    // Gerar pool único a partir dos ranges
    const numbersSet = new Set<number>();
    
    for (const range of ranges) {
      for (let i = range.start; i <= range.end; i++) {
        numbersSet.add(i);
      }
    }
    
    const pool = Array.from(numbersSet).sort((a, b) => a - b);
    
    set({ 
      ranges, 
      pool,
      // Limpar números sorteados se não permitir repetição
      drawn: get().options.allowRepeats ? get().drawn : []
    });
    
    get().persist();
  },

  setInputMode: (mode: InputMode) => {
    set({ inputMode: mode });
  },

  drawOne: () => {
    const state = get();
    
    if (state.isSpinning) {
      return null;
    }
    
    // Se não permite repetição, verificar se ainda há números disponíveis
    if (!state.options.allowRepeats) {
      const drawnValues = state.drawn.map(d => d.value);
      const availableNumbers = state.pool.filter(n => !drawnValues.includes(n));
      
      if (availableNumbers.length === 0) {
        return null; // Pool esgotado
      }
      
      // Usar RNG com seed se fornecido
      const rng = new RNG(state.options.seed);
      const drawnNumber = rng.choice(availableNumbers);
      
      // Armazenar como pendente
      set({
        pendingDraw: drawnNumber,
        lastDrawn: drawnNumber,
      });
      
      return drawnNumber;
    }
    
    // Se permite repetição, usar todos os números do pool
    const availableNumbers = [...state.pool];
    
    if (availableNumbers.length === 0) {
      return null; // Pool vazio
    }
    
    // Usar RNG com seed se fornecido
    const rng = new RNG(state.options.seed);
    const drawnNumber = rng.choice(availableNumbers);
    
    // Armazenar como pendente
    set({
      pendingDraw: drawnNumber,
      lastDrawn: drawnNumber,
    });
    
    return drawnNumber;
  },

  confirmDraw: () => {
    const state = get();
    
    if (state.pendingDraw === null) {
      return;
    }
    
    // Adicionar ao histórico
    const newDrawn: DrawnNumber = {
      value: state.pendingDraw,
      at: new Date().toISOString(),
    };
    
    set({
      drawn: [newDrawn, ...state.drawn], // Mais recente primeiro
      pendingDraw: null, // Limpar pendente
    });
    
    get().persist();
  },

  setSpinning: (spinning: boolean) => {
    set({ isSpinning: spinning });
  },

  setCurrentRotation: (rotation: number) => {
    set({ currentRotation: rotation });
  },

  removeFromPool: (number: number) => {
    const state = get();
    const newPool = state.pool.filter(n => n !== number);
    
    set({ pool: newPool });
    get().persist();
  },

  toggleAllowRepeats: () => {
    const state = get();
    const newOptions = {
      ...state.options,
      allowRepeats: !state.options.allowRepeats,
    };
    
    set({ options: newOptions });
    get().persist();
  },

  resetAll: () => {
    set({
      ...initialState,
      // Manter modo de entrada e valores atuais
      inputMode: get().inputMode,
      quantity: get().quantity,
      ranges: get().ranges,
    });
    
    clearDrawState();
  },

  clearHistoryOnly: () => {
    set({ drawn: [], lastDrawn: undefined, pendingDraw: null });
    clearHistory();
  },

  hydrate: () => {
    const savedState = loadDrawState();
    
    if (Object.keys(savedState).length > 0) {
      set((state) => ({
        ...state,
        ...savedState,
      }));
    }
  },

  persist: () => {
    const state = get();
    saveDrawState({
      pool: state.pool,
      drawn: state.drawn,
      options: state.options,
    });
  },
}));

// Utilitários para uso nos componentes
export const useAvailableNumbers = () => {
  const { pool, drawn, options } = useDrawStore();
  
  if (options.allowRepeats) {
    return pool;
  }
  
  const drawnValues = drawn.map(d => d.value);
  return pool.filter(n => !drawnValues.includes(n));
};

export const useCanDraw = () => {
  const availableNumbers = useAvailableNumbers();
  const isSpinning = useDrawStore(state => state.isSpinning);
  
  return availableNumbers.length > 0 && !isSpinning;
};

export const useDrawnNumbers = () => {
  const drawn = useDrawStore(state => state.drawn);
  return drawn.map(d => d.value);
};
