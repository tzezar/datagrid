
import { type ColumnDef } from "$lib/datagrid/core/types";
import { accessorColumn, columnGroup, computedColumn } from "$lib/datagrid/core/column-creation";
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
        options: {
            calculateFacets: true
        },
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


    columnGroup({
        header: "Grupa",
        columns: [
            columnGroup({
                header: 'Product',
                columns: [
                    accessorColumn({
                        accessorKey: 'name',
                        options: {
                            calculateFacets: true
                        }, _meta: {
                            grow: true,
                            clickToCopy: true,
                            filterType: 'text',
                        }
                    }),
                    accessorColumn({
                        accessorKey: 'category',
                        _meta: {
                            clickToCopy: false
                        }
                    }),
        
                ]
            }),
            columnGroup({
                header: 'Stock',
                columns: [
                    accessorColumn({
                        accessorKey: 'quantity'
                    }),
                    computedColumn({
                        header: 'Test',
                        columnId: 'test',
                        getValueFn: (row) => row.category + row.id,
                        _meta: {
                            filterType: 'text'
                        }
                    }),
                ]
            }),
        ]
    }),

    columnGroup({
        header: 'Pricing',
        columns: [
            accessorColumn({
                header: 'Price',
                accessorKey: 'price',
                getValueFn: (row) => row.price,
                options: { sortable: true },
                _meta: {
                    filterType: 'number',
                //     styles: {
                //         bodyCell({props}) {
                //             const { row } = props
                //             if (row.isGroupRow()) return ""
                //             return cn(row.original.price < 400 && 'border-r-2 border-red-400', row.original.price > 1000 && 'border-r-2 border-green-400')
        
                //         },
        
                //     }
                }
            }),
            accessorColumn({
                accessorKey: 'supplier.name'
            }),
        ]
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

] satisfies ColumnDef<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]