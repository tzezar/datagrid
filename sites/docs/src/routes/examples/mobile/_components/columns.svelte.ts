import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',

    },
    {
        id: 'location',
        title: 'Location',

    },
    {
        id: 'category',
        title: 'Category',
    },
    {
        id: 'quantity',
        title: 'Quantiy',
    },
    {
        id: 'weight',
        title: 'Weight',

    }
] satisfies BaseColumn<InventoryDataRow>[]
