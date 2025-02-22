import { generateData } from "$lib/data-generators/generate-data";
import { generateCreature } from "$lib/data-generators/generate/creature";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";
import { generateRecipe } from "$lib/data-generators/generate/recipe";
import { generateSolarSystem } from "$lib/data-generators/generate/solar-system";
import { generateUser } from "$lib/data-generators/generate/user";
import { generateVideoGame } from "$lib/data-generators/generate/video-game";

export const inventoryData = $state(generateData(generateInventoryItem, 1000))
export const creatureData = $state(generateData(generateCreature, 1000))
export const recipeData = $state(generateData(generateRecipe, 1000))
export const solarSystemData = $state(generateData(generateSolarSystem, 1000))
export const userData = $state(generateData(generateUser, 1000))
export const videoGameData = $state(generateData(generateVideoGame, 1000))


