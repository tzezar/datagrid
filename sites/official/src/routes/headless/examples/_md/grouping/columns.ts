import type { ColumnDef } from "$lib/datagrid/types"
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
        groupable: false,
        aggregationFn: 'count',
        size: {
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            grow: false
        },
    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        size: {
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            grow: false
        },
    },
    {
        accessorKey: 'region',
        header: 'Region',
        resizable: false,
        size: {
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            grow: false
        },
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',
        groupable: false,
        aggregationFn: 'mean',
        size: {
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            grow: false
        },
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
        size: {
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            grow: false
        },
        groupable: false,
        aggregationFn: 'sum',
    }
] satisfies ColumnDef<SalesDataRow, string>[]

