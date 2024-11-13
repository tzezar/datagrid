import type { ColumnDef } from "$lib/datagrid/types"
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
        _meta: {
            type: 'text',
            operators: ['contains', 'equals']
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',

        _meta: {
            type: 'number',
            operators: ['between', 'equals', 'greaterThan', 'lessThan', 'contains']
        }
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
    }
] satisfies ColumnDef<SalesDataRow, string>[]

