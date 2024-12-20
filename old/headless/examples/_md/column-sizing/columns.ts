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
        resizable: false,
        size: {
            grow: false,
            width: 200,
            minWidth: 200,
            maxWidth: 200
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

