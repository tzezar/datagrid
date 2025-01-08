import ActionsCell from "./_components/cells/cell-actions.svelte";
import { createAccessorColumn, createColumnGroup, createComputedColumn, createDisplayColumn, type AnyColumn } from "../../../lib/datagrid/core/helpers/column-creators";
import type { User } from "./generate-users";


export const userColumns: AnyColumn<User>[] = [
    // Grouped columns for stats
    createAccessorColumn({
        header: 'ID',
        columnId: 'id',
        accessorKey: 'id',
        getValueFn: (user) => user.id,
    }),
    createAccessorColumn({
        header: 'status',
        columnId: 'status',
        accessorKey: 'status',
        getValueFn: (user) => user.status,
    }),
    createAccessorColumn({
        header: 'role',
        columnId: 'role',
        accessorKey: 'role',
        getValueFn: (user) => user.role,
    }),

    createColumnGroup({
        header: 'Person',
        columnId: 'person',
        columns: [
            createColumnGroup({
                header: 'Personal Info',
                columnId: 'personalInfo',
                columns: [
                    createAccessorColumn({
                        header: 'First Name',
                        columnId: 'firstName',
                        accessorKey: 'firstName',
                        getValueFn: (user) => user.firstName,
                        options: {
                            sortable: true
                        }
                    }),
                    createAccessorColumn({
                        header: 'Last Name',
                        columnId: 'lastName',
                        accessorKey: 'lastName',
                        getValueFn: (user) => user.lastName,
                        options: {
                            sortable: true
                        }
                    }),
                ]
            }),
            createColumnGroup({
                header: 'Profile',
                columnId: 'profile',
                columns: [
                    createAccessorColumn({
                        header: 'Email',
                        columnId: 'email',
                        accessorKey: 'profile.email',
                        getValueFn: (user) => user.profile.email,
                        options: {
                            sortable: true
                        }
                    }),
                    createAccessorColumn({
                        header: 'Country',
                        columnId: 'country',
                        accessorKey: 'profile.country',
                        getValueFn: (user) => user.profile.country,
                        options: {
                            sortable: true
                        }
                    })
                ]
            })]
    }),

    createColumnGroup({
        header: 'Stats',
        columnId: 'stats',
        columns: [
            createAccessorColumn({
                header: 'Visits',
                columnId: 'visits',
                accessorKey: 'stats.visits',
                getValueFn: (user) => user.stats.visits,
                options: { sortable: true }
            }),
            createComputedColumn({
                header: 'Last Login',
                columnId: 'lastLogin',
                accessorFn: (user) => user.stats.lastLogin.toLocaleString(),
                getValueFn: (user) => user.stats.lastLogin,
                options: { sortable: true }
            }),
            createAccessorColumn({
                header: 'Avg. Session (mins)',
                columnId: 'averageSessionDuration',
                accessorKey: 'stats.averageSessionDuration',
                getValueFn: (user) => user.stats.averageSessionDuration,
                options: { sortable: true, filterable: true },
                _meta: {
                    filterType: 'number'
                }
            })
        ]
    }),
];