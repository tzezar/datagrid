import type { ColumnDef } from "$lib/tzezars-datagrid/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"
import Actions from "./actions.svelte"

export const columns = [
    {
        accessorKey: 'actions',
        header: 'Actions',
        filterable: false,
        sortable: false,
        groupable: false,
        align: 'center',
        cell: {
            component: Actions
        },
    },
    {
        accessorKey: 'id',
        header: 'ID',
        align: 'end',
        sortable: true,
        groupable: false,
        aggregationFn: 'count',
        cell: {
            style: (row) => {
                let style = ""
                if (+row.index % 2 === 1) {
                    style = "font-weight: bold;"
                }
                return style
            }
        }

    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        size: {
            width: -1,
            minWidth: -1,
            maxWidth: -1,
            grow: true
        },
    },
    {
        accessorKey: 'region',
        header: 'Region',
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',
        groupable: false,
        aggregationFn: 'sum',
        formatter: (row) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
        groupable: false,
        aggregationFn: 'mean',
        formatter: (row) => row.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        cell: {
            style: (row) => {
                let style = ""
                if (row.original.profit < -1000) {
                    style = "color: red; border-right-color: red; border-right-style: solid; border-right-width: 1px;"
                } else if (row.original.profit > 2000) {
                    style = "color: green; border-right-color: green; border-right-style: solid; border-right-width: 1px;"
                }
                return style
            },
        }
    }
] satisfies ColumnDef<SalesDataRow, string>[]

