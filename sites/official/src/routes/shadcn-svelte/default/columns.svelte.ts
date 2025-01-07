import ActionsCell from "./_components/cells/cell-actions.svelte";
import CellRowPinning from "./_components/cells/cell-row-pinning.svelte";
import { createAccessorColumn, createColumnGroup, createComputedColumn, createDisplayColumn, type AnyColumn } from "../../../lib/datagrid/core/helpers/column-creators";
import SelectRowCell from "./_components/cells/cell-select-row.svelte";
import type { User } from "./generate-users";


export const userColumns: AnyColumn<User>[] = [
    // Grouped columns for stats
    createAccessorColumn({
        header: 'ID',
        columnId: 'id',
        accessorKey: 'id',
        getValueFn: (row) => row.id,
    }),
    createAccessorColumn({
        header: 'status',
        columnId: 'status',
        accessorKey: 'status',
        getValueFn: (row) => row.status,
    }),
    createAccessorColumn({
        header: 'role',
        columnId: 'role',
        accessorKey: 'role',
        getValueFn: (row) => row.role,
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
                        getValueFn: (row) => row.firstName,
                        options: {
                            sortable: true
                        }
                    }),
                    createAccessorColumn({
                        header: 'Last Name',
                        columnId: 'lastName',
                        accessorKey: 'lastName',
                        getValueFn: (row) => row.lastName,
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
                        getValueFn: (row) => row.profile.email,
                        options: {
                            sortable: true
                        }
                    }),
                    createAccessorColumn({
                        header: 'Country',
                        columnId: 'country',
                        accessorKey: 'profile.country',
                        getValueFn: (row) => row.profile.country,
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
                getValueFn: (row) => row.stats.visits,
                options: { sortable: true }
            }),
            createComputedColumn({
                header: 'Last Login',
                columnId: 'lastLogin',
                accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                getValueFn: (row) => row.stats.lastLogin,
                options: { sortable: true }
            }),
            createAccessorColumn({
                header: 'Avg. Session (mins)',
                columnId: 'averageSessionDuration',
                accessorKey: 'stats.averageSessionDuration',
                getValueFn: (row) => row.stats.averageSessionDuration,
                options: { sortable: true, filterable: true },
                _meta: {
                    filterType: 'number'
                }
            })
        ]
    }),
];