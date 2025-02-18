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
        align: 'end',
        sortable: true,
    },
    {
        id: 'weight',
        title: 'Weight',
        align: 'end',
        sortable: true,
    },
    {
        id: 'quantity',
        title: 'Quantity',
        sortable: true,
        align: 'end',
    },
    {
        id: 'expand',
        title: '',
        align: 'center',
        width: '60px',
    },
] satisfies BaseColumn<InventoryDataRow>[]
