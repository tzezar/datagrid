import { inventoryData } from "$lib/data/data-storage.svelte.js";
import { error } from '@sveltejs/kit';

// Helper function to add sleep (delay)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const load = async ({ url }) => {
    try {
        // Sleep for 100ms before proceeding
        await sleep(1000);

        // Pagination logic for inventory
        const page = Number(url.searchParams.get('page') || 1);
        const pageSize = Number(url.searchParams.get('pageSize') || 10);
        const totalInventory = inventoryData;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Fetch content based on params
        const post = await import(`./pagination-on-backend.md`);

        return {
            inventory: totalInventory.slice(startIndex, endIndex),
            totalCount: totalInventory.length,
            currentPage: page,
            pageSize: pageSize,
            content: post.default,
            meta: post.metadata
        };
    } catch (e) {
        console.error(e);
        error(404, `Could not find pagination-on-backend`);
    }
};
