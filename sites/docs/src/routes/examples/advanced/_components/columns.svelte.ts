import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'checkbox',
        title: 'Row selection',
        width: '50px',
        pinned: {
            position: 'left'
        },
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false,
        moveable: false
    },

    {
        id: 'expand',
        title: 'Row expand',
        width: '50px',
        pinnable: true,
        pinned: {
            position: 'left'
        },
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false,
        moveable: false
    },
    {
        id: 'product.name',
        title: 'Product name',
        sortable: true,
        grow: true,
        filterType: 'string',
        filterValue: '',
        pinnable: true,
        pinned: {
            position: 'left'
        }
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
        width: '130px',
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
        width: '120px',
    },
    {
        id: 'location',
        title: 'Location',
        width: '200px',
    },
    {
        id: 'manufacturer',
        title: 'Manufacturer',
        width: '200px',
    },
    {
        id: 'actions',
        title: 'Actions',
        width: '110px',
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false,
        hideable: false,
        pinned: {
            position: 'right'
        },
        align: 'start'
    }
] satisfies BaseColumn<InventoryDataRow>[]
