import type { ColumnDef } from "$lib/datagrid/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"
import Actions from "./actions.svelte"
import RowSelection from "./row-selection.svelte"

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
        accessorKey: 'selection',
        header: 'Selection',
        filterable: false,
        sortable: false,
        groupable: false,
        align: 'center',
        cell: {
            component: RowSelection
        },
    },
    {
        accessorKey: 'id',
        header: 'ID',
        align: 'end',
    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        size: {
            grow: true,
            width: -1,
            minWidth: 100,
            maxWidth: -1
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
        sortable: false
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
    }
] satisfies ColumnDef<SalesDataRow, string>[]

