import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        sortable: true,
        grow: true,
        filterType: 'string',
        filterValue: '',
    },
    {
        id: 'price',
        title: 'Price',
        sortable: true,
        filterType: 'range',
        filterValue: [-99999999999, 9999999999],
        align: 'end',
    },
    {
        id: 'quantity',
        title: 'Quantity',
        sortable: true,
        filterType: 'number',
        filterValue: '',
        align: 'end',

    },
    {
        id: 'category',
        title: 'Category',
        filterType: 'select',
        filterValue: '',
        options: [
            { label: 'Everything', value: '' },
            { label: 'Furniture', value: 'furniture' },
            { label: 'Clothing', value: 'clothing' },
            { label: 'Electronics', value: 'electronics' }
        ],
    },
    {
        id: 'expiration_date',
        title: 'Expiration date',
        filterType: 'date',
        filterValue: '',
    },
] satisfies BaseColumn<InventoryDataRow>[]
