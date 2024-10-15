import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',
        width: '200px',

    },
    {
        id: 'location',
        title: 'Location',
        grow: true,
        width: '200px',

    },
    {
        id: 'category',
        title: 'Category',
        pinnable: false,
        width: '1000px',
    },
    {
        id: 'quantity',
        title: 'Quantiy',
        width: '200px',
    },
    {
        id: 'weight',
        title: 'Weight',
        width: '200px',

    }
] satisfies BaseColumn<InventoryDataRow>[]
