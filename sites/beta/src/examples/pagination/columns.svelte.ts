import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Name',
        width: '300px',
        
    },
    {
        id: 'quantity',
        title: 'On stock',
        align: 'end',
    },
    {
        id: 'price',
        title: 'Price',
        align: 'end',
        grow: true,
    }
] satisfies BaseColumn<InventoryDataRow>[]
