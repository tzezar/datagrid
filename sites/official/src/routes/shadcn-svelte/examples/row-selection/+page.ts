import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";

export const ssr = false;

export const load = async () => {
    const users = generateData(generateInventoryItem, 100);
    return { users };
  };