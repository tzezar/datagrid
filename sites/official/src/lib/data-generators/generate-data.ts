import type { Generator as DataGenerator } from "./types";

export function generateData(generator: DataGenerator, count: number): any[] {
  return Array.from({ length: count }, (_, index) => generator(index + 1));
}


