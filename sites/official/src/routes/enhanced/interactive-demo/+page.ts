import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";


export const load = async () => {
    const inventory = generateData(generateInventoryItem, 10_000);
    return { inventory };
  };