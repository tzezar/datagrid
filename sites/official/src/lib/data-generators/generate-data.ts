import type { Generator as DataGenerator } from "./types";

export function generateData(generator: DataGenerator, count: number): any[] {
  return Array.from({ length: count }, (_, index) => generator(index + 1));
}


export function generateDataInBatches<T>(
	generator: () => T,
	total: number,
	batchSize: number,
	callback: (batch: T[]) => void
) {
	let generated = 0;

	const generateBatch = () => {
		const batch: T[] = [];
		for (let i = 0; i < batchSize && generated < total; i++) {
			batch.push(generator());
			generated++;
		}

		callback(batch);

		if (generated < total) {
			requestIdleCallback(generateBatch); 
		}
	};

	generateBatch();
}
