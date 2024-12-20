import type { ColumnDef } from "$lib/tzezars-datagrid/core/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"

export const columns = [
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
        pinnable: false,
        size: {
            grow: true,
            width: 1000,
            minWidth: 1000,
            maxWidth: 1000
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

