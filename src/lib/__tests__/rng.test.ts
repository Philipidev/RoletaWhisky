import { describe, it, expect } from 'vitest';
import { RNG } from '../rng';

describe('RNG', () => {
  it('deve gerar números consistentes com o mesmo seed', () => {
    const rng1 = new RNG(12345);
    const rng2 = new RNG(12345);
    
    const numbers1 = Array.from({ length: 10 }, () => rng1.nextInt(1, 100));
    const numbers2 = Array.from({ length: 10 }, () => rng2.nextInt(1, 100));
    
    expect(numbers1).toEqual(numbers2);
  });

  it('deve gerar números diferentes com seeds diferentes', () => {
    const rng1 = new RNG(12345);
    const rng2 = new RNG(54321);
    
    const numbers1 = Array.from({ length: 10 }, () => rng1.nextInt(1, 100));
    const numbers2 = Array.from({ length: 10 }, () => rng2.nextInt(1, 100));
    
    expect(numbers1).not.toEqual(numbers2);
  });

  it('deve gerar números dentro do intervalo especificado', () => {
    const rng = new RNG(12345);
    const min = 10;
    const max = 20;
    
    for (let i = 0; i < 100; i++) {
      const num = rng.nextInt(min, max);
      expect(num).toBeGreaterThanOrEqual(min);
      expect(num).toBeLessThan(max);
    }
  });

  it('deve escolher elementos de um array', () => {
    const rng = new RNG(12345);
    const array = [1, 2, 3, 4, 5];
    
    for (let i = 0; i < 50; i++) {
      const choice = rng.choice(array);
      expect(array).toContain(choice);
    }
  });

  it('deve embaralhar um array', () => {
    const rng = new RNG(12345);
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = rng.shuffle(original);
    
    // Deve ter o mesmo tamanho
    expect(shuffled).toHaveLength(original.length);
    
    // Deve conter todos os elementos originais
    expect([...shuffled].sort()).toEqual([...original].sort());
    
    // Com seed 12345, deve produzir uma ordem específica diferente do original
    // (testamos que o algoritmo funciona, não aleatoriedade)
    expect(shuffled).not.toEqual(original);
    
    // Teste adicional: dois shuffles com mesmo seed devem ser iguais
    const rng2 = new RNG(12345);
    const shuffled2 = rng2.shuffle(original);
    expect(shuffled).toEqual(shuffled2);
  });

  it('deve lançar erro ao escolher de array vazio', () => {
    const rng = new RNG(12345);
    expect(() => rng.choice([])).toThrow('Array não pode estar vazio');
  });
});
