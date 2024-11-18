import type { ColumnDef } from "$lib/tzezars-datagrid/core/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"


export const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        align: 'end',
        filterable: false,
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
        filterable: false,

    },

    {
        accessorKey: 'region',
        header: 'Region',
        filterable: false,
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',
        filterable: false,
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
        filterable: false,
    }
] satisfies ColumnDef<SalesDataRow, never>[]

