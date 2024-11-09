import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Name',
        grow: true,
        align: 'start',
    },
    {
        id: 'quantity',
        title: 'On stock',
        align: 'center',
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
        align: 'end',
        grow: true,
    }
] satisfies BaseColumn<InventoryDataRow>[]
