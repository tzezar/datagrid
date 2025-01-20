
import { type AnyColumn } from "$lib/datagrid/core/types";
import { displayColumn, accessorColumn, columnGroup, computedColumn } from "$lib/datagrid/core/column-creation";
import RowSelectionColumnHeaderCell from "$lib/datagrid/prebuilt/shadcn/built-in/row-selection-column-header-cell.svelte";
import RowSelectionBodyRowCell from "$lib/datagrid/prebuilt/shadcn/built-in/row-selection-body-row-cell.svelte";
import BodyRowActionsCell from "$lib/datagrid/prebuilt/shadcn/built-in/body-row-actions-cell.svelte";
import type { User } from "$lib/data-generators/generate/user";
import type { ShadcnColumnMeta } from "$lib/datagrid/prebuilt/shadcn/core/types";


// const exampleFn = (value) => {
//     console.log(value, value)
// }


export type Column = AnyColumn<User> & { _meta: { showColumnManagerDropdownMenu: boolean } }

export const userColumns = [
    displayColumn({
        header: 'Actions',
        columnId: 'actions',
        headerCell: () => `&nbsp;`,
        cell: () => {
            return {
                component: BodyRowActionsCell,
            }
        },
        options: { sortable: false, groupable: false, hideable: true },
        state: {
            size: {
                width: 60,
                minWidth: 60,
                maxWidth: 60,
            }
        },
        _meta: {
            align: 'center',
            showColumnManagerDropdownMenu: false
        } as ShadcnColumnMeta

    }),
    displayColumn({
        header: 'Row Selection',
        headerCell: () => ({
            component: RowSelectionColumnHeaderCell
        }),
        columnId: 'selectRow',
        cell: () => ({
            component: RowSelectionBodyRowCell,
        }),
        options: { sortable: false },
        state: {
            size: {
                width: 40,
                minWidth: 40,
                maxWidth: 40,
            }
        },
        _meta: {
            showColumnManagerDropdownMenu: false,
            align: 'center'
        } as ShadcnColumnMeta
    }),

    // displayColumn({
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
    accessorColumn({
        header: 'Id',
        columnId: 'id',
        accessorKey: 'id',
        getValueFn: (row) => row.id,
        options: { sortable: true, hideable: false },
        aggregate: 'count',
        _meta: {
            filterType: 'number',
        } as ShadcnColumnMeta
    }),
    columnGroup({
        header: 'Person',
        columnId: 'person',
        columns: [
            columnGroup({
                header: 'Personal Info',
                columns: [
                    accessorColumn({
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
                    accessorColumn({
                        header: 'Last Name',
                        columnId: 'lastName',
                        accessorKey: 'lastName',
                        getValueFn: (row) => row.lastName,
                        options: {
                            sortable: true
                        }
                    }),
                    accessorColumn({
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
            columnGroup({
                header: 'Profile',
                columnId: 'profile',
                columns: [
                    accessorColumn({
                        header: 'Email',
                        columnId: 'email',
                        accessorKey: 'profile.email',
                        getValueFn: (row) => row.profile.email,
                        options: {
                            sortable: true
                        }
                    }),
                    accessorColumn({
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
    accessorColumn({
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
    computedColumn({
        header: 'Full Name',
        columnId: 'fullName',
        // accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        getValueFn: (row) => `${row.firstName} ${row.lastName}`,
        options: { sortable: true },
        getGroupValueFn: (row) => {
            const fullName = `${row.firstName} ${row.lastName}`;
            // Optional: Group by first letter or first word
            return fullName.charAt(0).toUpperCase();
        },

    }),
    accessorColumn({
        // header: 'Role',
        // columnId: 'role',
        accessorKey: 'role',
        // getValueFn: (row) => row.role,
        // cell: (row) => `<span class="badge role-${row.role}">${row.role.toUpperCase()}</span>`,
        options: { sortable: true },
        _meta: {
            filterType: 'text'
        }
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
                options: { sortable: true }
            }),
            computedColumn({
                header: 'Last Login',
                columnId: 'lastLogin',
                // accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                getValueFn: (row) => row.stats.lastLogin,
                options: { sortable: true }
            }),
            accessorColumn({
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
] satisfies AnyColumn<User>[]