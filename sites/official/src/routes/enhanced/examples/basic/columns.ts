
import { type AnyColumn } from "$lib/datagrid/core/types";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";

export const columns = [
    accessorColumn({
        accessorKey: 'id',
        _meta: {
            tooltip: true,
        }
    }),
    accessorColumn({
        accessorKey: 'name',
        formatterFn: (row) => row.name.toUpperCase(), 
        _meta: {
            grow: true,
            clickToCopy: false
        }
    }),
    accessorColumn({
        accessorKey: 'category',
        _meta: {
            clickToCopy: false
        }
    }),
    accessorColumn({
        header: 'Price',
        accessorKey: 'price',
        getValueFn: (row) => row.price,
        options: { sortable: true },
    }),
    accessorColumn({
        accessorKey: 'quantity'
    }),
    accessorColumn({
        accessorKey: 'supplier.name'
    }),
    accessorColumn({
        columnId: 'restockDate',
        accessorKey: 'restockDate',
        getValueFn: (row) => row.restockDate,
        options: { sortable: true },
        _meta: {
            filterType: 'date'
        }
    }),
    accessorColumn({
        accessorKey: 'status',


    }),

] satisfies AnyColumn<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]