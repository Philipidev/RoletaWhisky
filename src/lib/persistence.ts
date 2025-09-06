import type { DrawState, DrawnNumber, DrawOptions } from './types';

const STORAGE_KEYS = {
  POOL: 'roulette.pool',
  DRAWN: 'roulette.drawn',
  OPTIONS: 'roulette.options',
  VERSION: 'roulette.version',
} as const;

const CURRENT_VERSION = '1.0.0';

/**
 * Salva o estado da roleta no localStorage
 */
export function saveDrawState(state: Partial<DrawState>): void {
  try {
    if (state.pool) {
      localStorage.setItem(STORAGE_KEYS.POOL, JSON.stringify(state.pool));
    }
    
    if (state.drawn) {
      localStorage.setItem(STORAGE_KEYS.DRAWN, JSON.stringify(state.drawn));
    }
    
    if (state.options) {
      localStorage.setItem(STORAGE_KEYS.OPTIONS, JSON.stringify(state.options));
    }
    
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  } catch (error) {
    console.warn('Erro ao salvar estado no localStorage:', error);
  }
}

/**
 * Carrega o estado da roleta do localStorage
 */
export function loadDrawState(): Partial<DrawState> {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    
    // Se não há versão ou é incompatível, limpar dados antigos
    if (!version || version !== CURRENT_VERSION) {
      clearDrawState();
      return {};
    }

    const poolData = localStorage.getItem(STORAGE_KEYS.POOL);
    const drawnData = localStorage.getItem(STORAGE_KEYS.DRAWN);
    const optionsData = localStorage.getItem(STORAGE_KEYS.OPTIONS);

    const state: Partial<DrawState> = {};

    if (poolData) {
      const pool = JSON.parse(poolData);
      if (Array.isArray(pool) && pool.every(n => typeof n === 'number')) {
        state.pool = pool;
      }
    }

    if (drawnData) {
      const drawn = JSON.parse(drawnData);
      if (Array.isArray(drawn) && isValidDrawnArray(drawn)) {
        state.drawn = drawn;
      }
    }

    if (optionsData) {
      const options = JSON.parse(optionsData);
      if (isValidDrawOptions(options)) {
        state.options = options;
      }
    }

    return state;
  } catch (error) {
    console.warn('Erro ao carregar estado do localStorage:', error);
    return {};
  }
}

/**
 * Limpa todos os dados da roleta do localStorage
 */
export function clearDrawState(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Erro ao limpar localStorage:', error);
  }
}

/**
 * Limpa apenas o histórico
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAWN);
  } catch (error) {
    console.warn('Erro ao limpar histórico:', error);
  }
}

/**
 * Valida se um array é um array válido de números sorteados
 */
function isValidDrawnArray(arr: unknown): arr is DrawnNumber[] {
  return Array.isArray(arr) && arr.every(item => 
    typeof item === 'object' && 
    item !== null &&
    typeof (item as any).value === 'number' &&
    typeof (item as any).at === 'string'
  );
}

/**
 * Valida se um objeto é um DrawOptions válido
 */
function isValidDrawOptions(obj: unknown): obj is DrawOptions {
  return typeof obj === 'object' && 
         obj !== null &&
         typeof (obj as any).allowRepeats === 'boolean' &&
         ((obj as any).seed === undefined || typeof (obj as any).seed === 'number');
}

/**
 * Migra dados de versões antigas (para futuras atualizações)
 */
export function migrateData(fromVersion: string, toVersion: string): void {
  // Implementar migrações futuras aqui
  console.log(`Migrando dados da versão ${fromVersion} para ${toVersion}`);
}
