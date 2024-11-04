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
        header: 'Sales'
    },
    {
        accessorKey: 'profit',
        header: 'Profit'
    }
];