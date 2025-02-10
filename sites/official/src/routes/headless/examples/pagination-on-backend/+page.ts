import { generateData } from "$lib/data-generators/generate-data";
import { generateInventoryItem } from "$lib/data-generators/generate/inventory";

// export const ssr = false;

export const load = async ({ url }) => {
	const page = Number(url.searchParams.get('page') || 1);
	const pageSize = Number(url.searchParams.get('pageSize') || 10);

	// const totalInventory = inventoryData
	const totalInventory = generateData(generateInventoryItem, 20_000);
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	return {
		inventory: totalInventory.slice(startIndex, endIndex),
		totalCount: totalInventory.length,
		currentPage: page,
		pageSize: pageSize
	};
};
