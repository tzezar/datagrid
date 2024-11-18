import type { ColumnDef } from "$lib/tzezars-datagrid/types"
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
        movable: false,
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

