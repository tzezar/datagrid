import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        sortable: true,
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
        sortable: true,
    },
] satisfies BaseColumn<InventoryDataRow>[]
