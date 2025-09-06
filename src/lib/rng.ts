/**
 * Gerador de números aleatórios com seed opcional para reproduzibilidade
 */
export class RNG {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 2147483647);
  }

  /**
   * Gera um número aleatório entre 0 e 1 usando Linear Congruential Generator
   */
  private next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  /**
   * Gera um número inteiro aleatório entre min (inclusive) e max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Gera um número float aleatório entre min (inclusive) e max (exclusive)
   */
  nextFloat(min: number = 0, max: number = 1): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Escolhe um elemento aleatório de um array
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Array não pode estar vazio');
    }
    const index = this.nextInt(0, array.length);
    return array[index];
  }

  /**
   * Embaralha um array usando Fisher-Yates shuffle
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Retorna o seed atual
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Define um novo seed
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }
}

// Instância global padrão
export const defaultRNG = new RNG();

/**
 * Função utilitária para gerar número aleatório simples
 */
export function randomInt(min: number, max: number): number {
  return defaultRNG.nextInt(min, max);
}

/**
 * Função utilitária para escolher elemento aleatório
 */
export function randomChoice<T>(array: T[]): T {
  return defaultRNG.choice(array);
}
