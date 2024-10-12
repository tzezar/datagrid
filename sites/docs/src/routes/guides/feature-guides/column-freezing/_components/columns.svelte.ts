import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',
        width: '200px',
        pinned: {
            position: 'left'
        },
    },

    {
        id: 'location',
        title: 'Location',
        width: '1500px',
    },

] satisfies BaseColumn<InventoryDataRow>[]
