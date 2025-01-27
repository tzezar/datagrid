import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";
import { generateUser } from "$lib/data-generators/generate/user";

export const ssr = false;

export const load = async () => {
    const users = generateData(generateUser, 100000);
    return { users };
  };