import ActionsCell from "./actions-cell.svelte";
import CellRowPinning from "./cell-row-pinning.svelte";
import { createAccessorColumn, createColumnGroup, createComputedColumn, createDisplayColumn, type AnyColumn } from "./datagrid/core/helpers/column-creators";
import SelectRowCell from "./select-row-cell.svelte";
import type { User } from "./types";

export const userColumns: AnyColumn<User>[] = [
    // Simple accessor columns
    // createDisplayColumn({
    //     header: 'Actions',
    //     columnId: 'actions',
    //     // TODO fix typing later
    //     cell: (row) => {
    //         return {
    //             component: ActionsCell,
    //             props: {
    //                 row,
    //             }
    //         }
    //     },
    //     options: { sortable: false },
    // }),
    // createDisplayColumn({
    //     header: 'Row Pinning',
    //     columnId: 'rowPinning',
    //     // TODO fix typing later
    //     cell: (row) => {
    //         return {
    //             component: CellRowPinning,
    //             props: {
    //                 row,
    //             }
    //         }
    //     },
    //     options: { sortable: false },
    //     _meta: {
    //         showInGroupRow: true
    //     }
    // }),
    // createDisplayColumn({
    //     header: 'Row Selection',
    //     columnId: 'selectRow',
    //     cell: (row) => {
    //         return {
    //             component: SelectRowCell,
    //             props: {
    //                 row,
    //             }
    //         }
    //     },
    //     options: { sortable: false },
    // }),
    createAccessorColumn({
        header: 'Id',
        accessorKey: 'id',
        columnId: 'id',
        parentColumnId: null,
        getValueFn: (row) => row.id,
        options: { sortable: true },
        _meta: {
            filterType: 'number'
        }
    }),
    // createAccessorColumn({
    //     header: 'First Name',
    //     accessorKey: 'firstName',
    //     columnId: 'firstName',
    //     getValueFn: (row) => row.firstName,
    //     options: { sortable: true },
    //     _meta: {
    //         filterType: 'text'
    //     }
    // }),

    // createAccessorColumn({
    //     header: 'Age',
    //     columnId: 'age',
    //     accessorKey: 'profile.age',
    //     getValueFn: (row) => row.profile.age,
    //     options: { sortable: true },
    //     _meta: {
    //         filterType: 'number'
    //     },
    //     getGroupValueFn: (row) => {
    //         const age = row.profile?.age;
    //         // Optional: You can bucket ages into ranges if needed
    //         return age !== undefined && age !== null
    //             ? Math.floor(age / 10) * 10 + '-' + (Math.floor(age / 10) * 10 + 9)
    //             : 'Unknown';
    //     },
    // }),
    // // Computed column for full name
    // createComputedColumn({
    //     header: 'Full Name',
    //     columnId: 'fullName',
    //     accessorFn: (row) => `${row.firstName} ${row.lastName}`,

    //     getValueFn: (row) => `${row.firstName} ${row.lastName}`,
    //     options: { sortable: true },
    //     getGroupValueFn: (row) => {
    //         const fullName = `${row.firstName} ${row.lastName}`;
    //         // Optional: Group by first letter or first word
    //         return fullName.charAt(0).toUpperCase();
    //     },

    // }),

    // // Conditional formatting for status
    // createAccessorColumn({
    //     header: 'Status',
    //     columnId: 'status',
    //     accessorKey: 'status',
    //     // cell: (row) => `<span class="${row?.status}">${row?.status.toUpperCase()}</span>`,
    //     getValueFn: (row) => row.status,
    //     options: { sortable: true },
    //     _meta: {
    //         filterType: 'select',
    //         filterOptions: [{ label: 'active', value: 'active' }, { label: 'inactive', value: 'inactive' }, { label: 'pending', value: 'pending' }]
    //     }
    // }),

    // Grouped columns for profile
    createColumnGroup({
        header: 'Profile',
        columnId: 'profile',
        parentColumnId: null,
        columns: [
            createAccessorColumn({
                header: 'Email',
                columnId: 'email',
                parentColumnId: 'profile',
                accessorKey: 'profile.email',
                getValueFn: (row) => row.profile.email,
                options: {
                    sortable: true
                }
            }),
            createAccessorColumn({
                header: 'Country',
                columnId: 'country',
                parentColumnId: 'profile',
                accessorKey: 'profile.country',
                getValueFn: (row) => row.profile.country,
                options: {
                    sortable: true
                }
            })
        ]
    }),

    // Grouped columns for stats
    createColumnGroup({
        header: 'Stats',
        columnId: 'stats',
        parentColumnId: null,
        columns: [
            createAccessorColumn({
                header: 'Visits',
                columnId: 'visits',
                parentColumnId: 'stats',
                accessorKey: 'stats.visits',
                getValueFn: (row) => row.stats.visits,
                options: { sortable: true }
            }),
            createComputedColumn({
                header: 'Last Login',
                columnId: 'lastLogin',
                parentColumnId: 'stats',
                accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                getValueFn: (row) => row.stats.lastLogin,
                options: { sortable: true }
            }),
            // createAccessorColumn({
            //     header: 'Avg. Session (mins)',
            //     columnId: 'averageSessionDuration',
            //     accessorKey: 'stats.averageSessionDuration',
            //     getValueFn: (row) => row.stats.averageSessionDuration,
            //     options: { sortable: true, filterable: true },
            //     _meta: {
            //         filterType: 'number'
            //     }
            // })
        ]
    }),
    // Role column with custom formatting
    // createAccessorColumn({
    //     header: 'Role',
    //     columnId: 'role',
    //     accessorKey: 'role',
    //     getValueFn: (row) => row.role,
    //     // cell: (row) => `<span class="badge role-${row.role}">${row.role.toUpperCase()}</span>`,
    //     options: { sortable: true },
    //     _meta: {
    //         filterType: 'text'
    //     }
    // })
];