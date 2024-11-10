import type { ColumnDef } from "$lib/datagrid/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"

export const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        size: {
            grow: true,
            width: 0,
            minWidth: 100,
            maxWidth: 6000
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
   
    }
] satisfies ColumnDef<SalesDataRow, string>[]

