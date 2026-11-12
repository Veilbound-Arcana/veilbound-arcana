/**
 * Mulberry32 32-bit seeded pseudo-random number generator.
 * Provides deterministic randomness for pack generation, coin flips, bot decisions and battle replays.
 */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class SeededRng {
  private next: () => number;

  constructor(public seed: number) {
    this.next = mulberry32(seed);
  }

  random(): number {
    return this.next();
  }

  range(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  choice<T>(list: readonly T[]): T {
    const idx = Math.floor(this.random() * list.length);
    return list[idx];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/** Global convenience deterministic RNG for session defaults */
export const defaultRng = new SeededRng(Date.now() & 0xffffffff);
