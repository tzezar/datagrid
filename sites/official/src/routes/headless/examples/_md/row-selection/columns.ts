import type { ColumnDef } from "$lib/tzezars-datagrid/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"
import RowSelection from "./row-selection.svelte"

export const columns = [
    {
        accessorKey: 'selection',
        header: 'Selection',
        filterable: false,
        sortable: false,
        groupable: false,
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
  
    },

    {
        accessorKey: 'region',
        header: 'Region',
        resizable: false,
        size: {
            grow: true,
            width: -1,
            minWidth: -1,
            maxWidth: -1
        },
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
    }
] satisfies ColumnDef<SalesDataRow, string>[]

