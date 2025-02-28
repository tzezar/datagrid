
import { type ColumnDef, type GridBasicRow, type LeafColumn } from "$lib/datagrid/core/types";
import { accessorColumn, columnGroup } from "$lib/datagrid/core/column-creation";
import type { InventoryItem } from "$lib/data-generators/generate/inventory";
import type { ColumnMetaEnhanced } from "$lib/datagrid-enhanced/core/types";
import { cn } from "$lib/utils";
import StatusCell from "./status-cell.svelte";
import type { EnhancedDatagrid } from "$lib/datagrid-enhanced/core/index.svelte";
import type { PreGeneratedInventoryItem } from "$lib/data/types";


// const exampleFn = (value) => {
//     console.log(value, value)
// }

export const columns = [
    accessorColumn({
        accessorKey: 'id',
        align: 'center',
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
        header: "Inventory",
        columns: [
            columnGroup({
                header: 'Product',
                columns: [
                    accessorColumn({
                        accessorKey: 'name',
                        state: {
                            size: {
                                width: 240,
                                minWidth: 40,
                                maxWidth: 500
                            },
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
                        columnId: 'Category',
                        accessorKey: 'category',
                        state: {
                            size: {
                                width: 120,
                                minWidth: 40,
                                maxWidth: 500
                            }
                        },
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
                        header: 'On Hand',
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
                        header: 'Min Stock',
                        accessorKey: 'inventory.minStockLevel',
                        aggregate: 'sum',
                        align: 'right'
                    }),
                    accessorColumn({
                        header: 'Max Stock',
                        accessorKey: 'inventory.maxStockLevel',
                        aggregate: 'sum',
                        align: 'right'
                    }),
                    accessorColumn({
                        header: 'Location',
                        accessorKey: 'inventory.location',
                        align: 'right',
                    }),
                    accessorColumn({
                        accessorKey: 'metadata.barcode',
                        state: {
                            size: {
                                width: 130,
                                minWidth: 40,
                                maxWidth: 500
                            }
                        },
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

                _meta: {
                    filterType: 'number',
                }
            }),
            accessorColumn({
                header: 'Wholesale Price',
                accessorKey: 'price.wholesale',
                formatterFn: (row) => row.price.wholesale + " $",
                align: 'right',
                state: {
                    size: {
                        width: 120,
                        minWidth: 40,
                        maxWidth: 500
                    }
                },_meta: {
                    filterType: 'number',
                }
            }),
            accessorColumn({
                header: 'Currency',
                accessorKey: 'price.currency',
                align: 'right',
                _meta: {
                    filterType: 'number',
                }
            }),
        ]
    }),



    accessorColumn({
        header: 'Restock',
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
            grow: true,
            filterType: 'select',

        }

    }),

] satisfies ColumnDef<PreGeneratedInventoryItem, ColumnMetaEnhanced<PreGeneratedInventoryItem>>[]