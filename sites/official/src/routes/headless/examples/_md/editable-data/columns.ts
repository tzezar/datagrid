import type { ColumnDef } from "$lib/tzezars-datagrid/core/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"
import EditableCell from "./editable-cell.svelte"

export const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: {
            component: EditableCell
        },
        _meta: {
            type: 'number'
        }
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
        cell: {
            component: EditableCell
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
        cell: {
            component: EditableCell
        }
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        cell: {
            component: EditableCell
        },
        _meta: {
            type: 'number'
        }
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        cell: {
            component: EditableCell
        },
        _meta: {
            type: 'number'
        }
    }
] satisfies ColumnDef<SalesDataRow, string>[]

