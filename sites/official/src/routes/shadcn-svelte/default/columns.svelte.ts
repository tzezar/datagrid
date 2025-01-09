import ActionsCell from "./_components/cells/cell-actions.svelte";
import { createAccessorColumn, createColumnGroup, createComputedColumn, createDisplayColumn, type AnyColumn } from "../../../lib/datagrid/core/helpers/column-creators";
import SelectRowCell from "./_components/cells/cell-select-row.svelte";
import type { User } from "./generate-users";



// const exampleFn = (value) => {
//     console.log(value, value)
// }


export const userColumns: AnyColumn<User>[] = [
    createDisplayColumn({
        header: 'Actions',
        columnId: 'actions',
        cell: () => {
            return {
                component: ActionsCell,
            }
        },
        options: { sortable: false },
        state: {
            size: {
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                grow: false
            }
        }

    }),
    createDisplayColumn({
        header: 'Row Selection',
        columnId: 'selectRow',
        cell: () => ({
            component: SelectRowCell,
        }),
        options: { sortable: false },
    }),

    // createDisplayColumn({
    //     header: 'Row Selection',
    //     columnId: 'selectRow',
    //     cell: ({ column, row, datagrid }) => ({
    //         component: SelectRowCell,
    //         props: {
    //             test: 'test',
    //             fn: ({value}) => exampleFn(value) 
    //         }
    //     }),
    //     options: { sortable: false },
    // }),
    createAccessorColumn({
        header: 'Id',
        columnId: 'id',
        accessorKey: 'id',
        getValueFn: (row) => row.id,
        options: { sortable: true, hideable: false },
        aggregate: 'count',
        _meta: {
            filterType: 'number'
        }
    }),
    createAccessorColumn({
        header: 'Status',
        columnId: 'status',
        accessorKey: 'status',
        // cell: ({ row }) => `<span class="${row?.original.status}">${row?.original.status?.toUpperCase()}</span>`,
        formatter: (row) => row.status?.toUpperCase(),
        getValueFn: (row) => row.status,
        options: { sortable: true },
        _meta: {
            filterType: 'select',
            filterOptions: [{ label: 'active', value: 'active' }, { label: 'inactive', value: 'inactive' }, { label: 'pending', value: 'pending' }]
        }
    }),
    createComputedColumn({
        header: 'Full Name',
        columnId: 'fullName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        getValueFn: (row) => `${row.firstName} ${row.lastName}`,
        options: { sortable: true },
        getGroupValueFn: (row) => {
            const fullName = `${row.firstName} ${row.lastName}`;
            // Optional: Group by first letter or first word
            return fullName.charAt(0).toUpperCase();
        },

    }),
    createAccessorColumn({
        header: 'Role',
        columnId: 'role',
        accessorKey: 'role',
        getValueFn: (row) => row.role,
        // cell: (row) => `<span class="badge role-${row.role}">${row.role.toUpperCase()}</span>`,
        options: { sortable: true },
        _meta: {
            filterType: 'text'
        }
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
                        accessorKey: 'firstName',
                        columnId: 'firstName',
                        getValueFn: (row) => row.firstName,
                        options: {
                            sortable: true,
                        },
                        _meta: {
                            filterType: 'text'
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
                    createAccessorColumn({
                        header: 'Age',
                        columnId: 'age',
                        accessorKey: 'profile.age',
                        getValueFn: (row) => row.profile.age,
                        aggregate: [
                            'sum',
                            {
                                type: 'custom',
                                fn: (values) => {
                                    // Moving average
                                    const window = 3;
                                    return values
                                        .slice(-window)
                                        .reduce((sum, val) => sum + val, 0) / window;
                                }
                            },
                            {
                                type: 'custom',
                                fn: (values) => {
                                    // Year-over-year growth
                                    const thisYear = values.slice(-12).reduce((sum, val) => sum + val, 0);
                                    const lastYear = values.slice(-24, -12).reduce((sum, val) => sum + val, 0);
                                    return ((thisYear - lastYear) / lastYear) * 100;
                                }
                            }
                        ],
                        options: { sortable: true },
                        _meta: {
                            filterType: 'number'
                        },
                        getGroupValueFn: (row) => {
                            const age = row.profile?.age;
                            // Optional: You can bucket ages into ranges if needed
                            return age !== undefined && age !== null
                                ? Math.floor(age / 10) * 10 + '-' + (Math.floor(age / 10) * 10 + 9)
                                : 'Unknown';
                        },
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