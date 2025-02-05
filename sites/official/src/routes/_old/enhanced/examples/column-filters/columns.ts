
import { type AnyColumn } from "$lib/datagrid/core/types";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";

export const columns = [
    accessorColumn({
        accessorKey: 'id',
        _meta: {
            filterType: 'number'
        }
    }),
    accessorColumn({
        accessorKey: 'name',
        _meta: {
            grow: true,
            filterType: 'text'
        }
    }),
    accessorColumn({
        accessorKey: 'category',
        _meta: {
            filterType: 'select',
            filterOptions: [{ label: 'Health', value: 'health' }, { label: 'Beauty', value: 'beauty' }] 
        }
    }),
    accessorColumn({
        accessorKey: 'price',
    }),
    accessorColumn({
        accessorKey: 'quantity'
    }),
    accessorColumn({
        accessorKey: 'supplier.name'
    }),
    accessorColumn({
        accessorKey: 'restockDate',
    }),
    accessorColumn({
        accessorKey: 'status',
    }),
] satisfies AnyColumn<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]