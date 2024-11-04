import type { ColumnDef, Data } from "$lib/datagrid/types";

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
        header: 'Region'
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        formatter: (row: Data) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },
    {
        accessorKey: 'profit',
        header: 'Profit'
    }
] satisfies ColumnDef[]