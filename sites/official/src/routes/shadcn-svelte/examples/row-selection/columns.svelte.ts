
import { type AnyColumn } from "$lib/datagrid/core/types";
import { displayColumn, accessorColumn, columnGroup, computedColumn } from "$lib/datagrid/core/column-creation";
import RowSelectionColumnHeaderCell from "$lib/datagrid/prebuilt/shadcn/components/row-selection-column-header-cell.svelte";
import RowSelectionBodyRowCell from "$lib/datagrid/prebuilt/shadcn/components/row-selection-body-row-cell.svelte";
import type { ShadcnColumnMeta } from "$lib/datagrid/prebuilt/shadcn/core/types";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";


// const exampleFn = (value) => {
//     console.log(value, value)
// }

export const inventoryColumns = [
    // displayColumn({
    //     header: 'Row Selection',
    //     headerCell: () => ({
    //         component: RowSelectionColumnHeaderCell
    //     }),
    //     columnId: 'selectRow',
    //     cell: () => ({
    //         component: RowSelectionBodyRowCell,
    //     }),
    //     options: { sortable: false },
    //     state: {
    //         size: {
    //             width: 40,
    //             minWidth: 40,
    //             maxWidth: 40,
    //         }
    //     },
    //     _meta: {
    //         showColumnManagerDropdownMenu: false,
    //         align: 'center'
    //     } as ShadcnColumnMeta
    // }),
    accessorColumn({
        accessorKey: 'id'
    }),
    accessorColumn({
        accessorKey: 'name'
    }),
    accessorColumn({
        accessorKey: 'category'
    }),
    accessorColumn({
        header: 'Price',
        accessorKey: 'price',
        getValueFn: (row) => row.price,
        options: { sortable: true },
        _meta: {
            filterType: 'number'
        }
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
        accessorKey: 'status'
    }),
   
] satisfies AnyColumn<InventoryItem>[]