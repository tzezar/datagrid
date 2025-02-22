import PaginationOnBackendDatagrid from "../_datagrids/pagination-on-backend/pagination-on-backend-datagrid.svelte";
import PaginationOnBackendDatagridCode from "../_datagrids/pagination-on-backend/pagination-on-backend-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";


const pageTs = `import { inventoryData } from "$lib/data/data-storage.svelte.js";
import { error } from '@sveltejs/kit';

// Helper function to add sleep (delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const load = async ({ url, params }) => {
    try {
        // Sleep for 100ms before proceeding
        await sleep(1000);

        // Pagination logic for inventory
        const page = Number(url.searchParams.get('page') || 1);
        const pageSize = Number(url.searchParams.get('pageSize') || 10);
        const totalInventory = inventoryData;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return {
            inventory: totalInventory.slice(startIndex, endIndex),
            totalCount: totalInventory.length,
            currentPage: page,
            pageSize: pageSize,
        };
    } catch (e) {
        console.error(e);
        error(404, 'something went wrong');
    }
};`


const exports = {
    datagrid: {
        component: PaginationOnBackendDatagrid,
        code: PaginationOnBackendDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    },

    code: {
        pageTs
    }
}

export { exports }