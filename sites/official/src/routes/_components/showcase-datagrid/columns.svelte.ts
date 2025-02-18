
import { type ColumnDef, type GridBasicRow, type LeafColumn } from "$lib/datagrid/core/types";
import { accessorColumn, columnGroup } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";
import { cn } from "$lib/utils";
import StatusCell from "./status-cell.svelte";
import type { EnhancedDatagrid } from "$lib/datagrid-enhanced/core/index.svelte";


// const exampleFn = (value) => {
//     console.log(value, value)
// }

export const columns = [
    accessorColumn({
        accessorKey: 'id',
        align: 'right',
        state: {
            pinning: {
                position: 'left'
            },
            size: {
                minWidth: 80,
                maxWidth: 120,
                width: 80
            }
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
                        state: {
                            pinning: {
                                // position: 'left'
                            },
                        },
                        _meta: {
                            // grow: true,
                            clickToCopy: true,
                            filterType: 'text',
                        }
                    }),
                    accessorColumn({
                        columnId: 'category',
                        accessorKey: 'category',
                        options: {
                            calculateFacets: true
                        },
                        _meta: {
                            filterType: 'select',
                            // filterOptions: [
                            // { value: 'active', label: 'Active' },
                            // ]

                        },
                    }),

                ]
            }),
            columnGroup({
                header: 'Stock',
                columns: [
                    accessorColumn({
                        accessorKey: 'inventory.quantity',
                        aggregate: 'sum',
                        align: 'right',
                        _meta: {
                            styles: {
                                bodyCell: ((props: { datagrid: EnhancedDatagrid, column: LeafColumn<InventoryItem>, row: GridBasicRow<InventoryItem> }) => {
                                    const classes = cn(
                                        props.row.original.inventory.quantity <= props.row.original.inventory.minStockLevel && 'bg-red-500/20',
                                        props.row.original.inventory.quantity >= props.row.original.inventory.maxStockLevel - (0.2 * props.row.original.inventory.maxStockLevel) && 'bg-green-500/20')
                                    return classes
                                })
                            },
                        }
                    }),
                    accessorColumn({
                        accessorKey: 'inventory.minStockLevel',
                        aggregate: 'sum',
                        align: 'right'
                    }),
                    accessorColumn({
                        accessorKey: 'inventory.maxStockLevel',
                        aggregate: 'sum',
                        align: 'right'
                    }),
                    accessorColumn({
                        accessorKey: 'inventory.location',
                        align: 'right',
                    }),
                    accessorColumn({
                        accessorKey: 'metadata.barcode',
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
                accessorKey: 'price.retail',
                formatterFn: (row) => row.price.retail + " $",
                align: 'right',
                state: {
                    size: {
                        minWidth: 150,
                        maxWidth: 150,
                        width: 150
                    }
                },
                _meta: {
                    filterType: 'number',
                }
            }),
            accessorColumn({
                header: 'Wholesale',
                accessorKey: 'price.wholesale',
                formatterFn: (row) => row.price.wholesale + " $",
                align: 'right',
                state: {
                    size: {
                        minWidth: 150,
                        maxWidth: 150,
                        width: 150
                    }
                },
                _meta: {
                    filterType: 'number',
                }
            }),
            accessorColumn({
                header: 'Currency',
                accessorKey: 'price.currency',
                align: 'right',
                state: {
                    size: {
                        minWidth: 150,
                        maxWidth: 150,
                        width: 150
                    }
                },
                _meta: {
                    filterType: 'number',
                }
            }),
        ]
    }),



    accessorColumn({
        header: 'Next Restock Date',
        accessorKey: 'restockInfo.nextRestockDate',
        getValueFn: (row) => new Date(String(row.restockInfo.nextRestockDate)).toLocaleDateString(),
        options: { sortable: true },
        _meta: {
            filterType: 'date'
        }
    }),
    accessorColumn({
        accessorKey: 'status',
        cell: (props) => {
            return {
                component: StatusCell,
                props
            };
        },
        options: {
            calculateFacets: true,
        },
        _meta: {
            filterType: 'select',

        }

    }),

] satisfies ColumnDef<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[]