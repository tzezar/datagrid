import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";

export const ssr = false;

export const load = async () => {
  const post = await import(`./documentation.md`)
  const inventory = generateData(generateInventoryItem, 100000);
  return {
    inventory, content: post.default,
    meta: post.metadata
  };
};