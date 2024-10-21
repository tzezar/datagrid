import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        grow: true,
        sortable: true,
    },
    {
        id: 'category',
        title: 'Category',
        sortable: true,
    },
 
    {
        id: 'manufacturer',
        title: 'Manufacturer',
        sortable: true,
    },
    {
        id: 'price',
        title: 'Price',
        sortable: true,
    },
    {
        id: 'expand',
        title: 'Expand',
        align: 'center',
        width: '60px',
    },
] satisfies BaseColumn<InventoryDataRow>[]
