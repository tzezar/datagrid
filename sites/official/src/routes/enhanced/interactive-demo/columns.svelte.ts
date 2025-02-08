
import { type AnyColumn } from "$lib/datagrid/core/types";
import { accessorColumn, computedColumn } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import { cn } from "$lib/utils";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";


// const exampleFn = (value) => {
//     console.log(value, value)
// }

export const columns = [
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
        accessorKey: 'id',
        _meta: {
            tooltip: true,
            filterType: 'number',
            // styles: {
            //     bodyCell(props) {
            //         const { row, datagrid } = props
            //         if (row.isGroupRow()) return ""
            //         return cn(row.original.id === 1 && 'bg-green-400', shouldHighlightSelectedRow(datagrid, row) && 'bg-red-400')
            //     },
            // }
        }
    }),




    accessorColumn({
        accessorKey: 'name',
        _meta: {
            grow: true,
            clickToCopy: true,
            filterType: 'text',
        }
    }),
    computedColumn({
        header: 'Test',
        columnId: 'test',
        getValueFn: (row) => row.category + row.id,
        _meta: {
            filterType: 'text'
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
        _meta: {
            filterType: 'number',
            styles: {
                bodyCell(props) {
                    const { row } = props
                    if (row.isGroupRow()) return ""
                    return cn(row.original.price < 400 && 'border-r-2 border-red-400', row.original.price > 1000 && 'border-r-2 border-green-400')

                },

            }
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
        accessorKey: 'status',


    }),

] satisfies AnyColumn<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]