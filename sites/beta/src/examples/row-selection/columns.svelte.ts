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
        id: 'product.name',
        title: 'Name',
        grow: true,
    },
    {
        id: 'quantity',
        title: 'On stock',
        align: 'end',
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
        moveable: false,
        align: 'end',
        grow: true,
    }

] satisfies BaseColumn<InventoryDataRow>[]
