import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";

// export const ssr = false;
export const prerender = true;

export const load = async () => {
    const inventory = generateData(generateInventoryItem, 100_000);
    return { inventory };
  };