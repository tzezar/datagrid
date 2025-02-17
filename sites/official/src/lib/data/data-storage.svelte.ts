import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";

export const inventoryData = $state(generateData(generateInventoryItem, 1000))