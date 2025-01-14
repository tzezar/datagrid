import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn, columnGroup } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";



export const userColumns: AnyColumn<User>[] = [
    accessorColumn({
        header: 'Id',
        accessorKey: 'id',
    }),
    columnGroup({
        header: 'Person',
        columns: [
            columnGroup({
                header: 'Personal Info',
                columns: [
                    accessorColumn({
                        header: 'First Name',
                        accessorKey: 'firstName',
                    }),
                    accessorColumn({
                        header: 'Last Name',
                        accessorKey: 'lastName',
                    }),
                    accessorColumn({
                        header: 'Age',
                        accessorKey: 'profile.age',
                    }),
                ]
            }),
            columnGroup({
                header: 'Profile',
                columns: [
                    accessorColumn({
                        header: 'Email',
                        accessorKey: 'profile.email',
                    }),
                    accessorColumn({
                        header: 'Country',
                        accessorKey: 'profile.country',
                    })
                ]
            })]
    }),
]