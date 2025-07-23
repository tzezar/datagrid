import { generateData } from '$lib/data-generators/generate-data';
import { generateInventoryItem } from '$lib/data-generators/generate/inventory';

const inventory = generateData(generateInventoryItem, 100).sort(() => Math.random() - 0.5);

const sortInventory = (sortBy: string | null, sortOrder: string | null) => {
	if (!sortBy || !sortOrder || !['asc', 'desc'].includes(sortOrder)) {
		return inventory;
	}

	// Validate sortBy to ensure it's a valid column
	const validColumns = ['id', 'name', 'category']; // Adjust based on your InventoryItem type
	if (!validColumns.includes(sortBy)) {
		return inventory;
	}

	return [...inventory].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
		if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
		return 0;
	});
};

export const load = async ({ url }) => {
	const sortBy = url.searchParams.get('sortBy');
	const sortOrder = url.searchParams.get('sortOrder');

	const sortedInventory = sortInventory(sortBy, sortOrder);

	return {
		inventory: sortedInventory,
		sortBy,
		sortOrder
	};
};
