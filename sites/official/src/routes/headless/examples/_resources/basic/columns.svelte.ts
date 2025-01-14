import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";



export const basicColumns: AnyColumn<User>[] = [
    accessorColumn({
        accessorKey: 'firstName'
    }),
    accessorColumn({
        accessorKey: 'lastName',
        header: 'Last Name'
    }),
    accessorColumn({
        accessorKey: 'profile.age',
        header: 'Age',
        getValueFn: (row) => row.profile.age,
    }),
    accessorColumn({
        accessorKey: 'profile.country',
        header: 'Country',
        cell: ({ row }) => `<span class="badge badge-primary">${row.original.profile.country}</span>`,
    })
] 