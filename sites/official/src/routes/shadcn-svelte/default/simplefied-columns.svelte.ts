
import { type AnyColumn } from "$lib/datagrid/core/column-creation/types";
import type { User } from "./generate-users";


import { accessorColumn, columnGroup, computedColumn } from "$lib/datagrid/core/column-creation";

export type Column = AnyColumn<User> & { _meta: { showColumnManagerDropdownMenu: boolean } }

export const userColumns = [
    accessorColumn({
        header: 'Id',
        columnId: 'id',
        accessorKey: 'id',
        getValueFn: (row) => row.id,
    }),
    accessorColumn({
        header: 'Status',
        columnId: 'status',
        accessorKey: 'status',
        getValueFn: (row) => row.status,
    }),
    computedColumn({
        header: 'Full Name',
        columnId: 'fullName',
        getValueFn: (row) => `${row.firstName} ${row.lastName}`,
    }),
    accessorColumn({
        header: 'Role',
        columnId: 'role',
        accessorKey: 'role',
        getValueFn: (row) => row.role,
    }),

    columnGroup({
        header: 'Person',
        columnId: 'person',
        columns: [
            columnGroup({
                header: 'Personal Info',
                columnId: 'personalInfo',
                columns: [
                    accessorColumn({
                        header: 'First Name',
                        accessorKey: 'firstName',
                        columnId: 'firstName',
                        getValueFn: (row) => row.firstName,
                    }),
                    accessorColumn({
                        header: 'Last Name',
                        columnId: 'lastName',
                        accessorKey: 'lastName',
                        getValueFn: (row) => row.lastName,
                    }),
                    accessorColumn({
                        header: 'Age',
                        columnId: 'age',
                        accessorKey: 'profile.age',
                        getValueFn: (row) => row.profile.age,
                    }),
                ]
            }),
            columnGroup({
                header: 'Profile',
                columnId: 'profile',
                columns: [
                    accessorColumn({
                        header: 'Email',
                        columnId: 'email',
                        accessorKey: 'profile.email',
                        getValueFn: (row) => row.profile.email,
                    }),
                    accessorColumn({
                        header: 'Country',
                        columnId: 'country',
                        accessorKey: 'profile.country',
                        getValueFn: (row) => row.profile.country,
                    })
                ]
            })]
    }),
    columnGroup({
        header: 'Stats',
        columnId: 'stats',
        columns: [
            accessorColumn({
                header: 'Visits',
                columnId: 'visits',
                accessorKey: 'stats.visits',
                getValueFn: (row) => row.stats.visits,
            }),
            computedColumn({
                header: 'Last Login',
                columnId: 'lastLogin',
                getValueFn: (row) => row.stats.lastLogin,
            }),
            accessorColumn({
                header: 'Avg. Session (mins)',
                columnId: 'averageSessionDuration',
                accessorKey: 'stats.averageSessionDuration',
                getValueFn: (row) => row.stats.averageSessionDuration,
            })
        ]
    }),
] satisfies AnyColumn<User>[]