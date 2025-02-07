
import { type AnyColumn } from "$lib/datagrid/core/types";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";

export const columns = [
    accessorColumn({
        accessorKey: 'id', align: "right"
    }),
    accessorColumn({
        accessorKey: 'name', align: 'left'
    }),
    accessorColumn({
        accessorKey: 'category', align: 'center'
    }),
    accessorColumn({
        accessorKey: 'price', _meta: { grow: true }, align: 'right'
    }),
] satisfies AnyColumn<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]