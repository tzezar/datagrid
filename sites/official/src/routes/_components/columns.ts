import type { Row } from "$lib/datagrid/processors/data-processor.svelte";
import type { ColumnDef, Data } from "$lib/datagrid/types";
import Profit from "./cells/profit.svelte";

export const columns = [
    {
        accessorKey: 'id',
        header: 'ID'
    },
    {
        // accessorKey: 'department.name',
        accessorFn: (row: any) => row.department.name,
        header: 'Department'
    },
    {
        accessorKey: 'region',
        header: 'Region',
        cell: {
            style: (row: Row) => `${row.original.region === 'East' ? 'color: orange' : ''}`
        }
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        formatter: (row: Data) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        cell: {
            component: Profit
        }
    }
] satisfies ColumnDef[]