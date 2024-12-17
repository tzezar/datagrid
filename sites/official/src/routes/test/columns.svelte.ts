import { createAccessorColumn, createColumnGroup, createComputedColum, type ColumnDef } from "./datagrid/core/helpers/column-creators";
import type { User } from "./types";

export const userColumns: ColumnDef<User>[] = [
    // Simple accessor columns
    createAccessorColumn({
        header: 'Id',
        accessorKey: 'id',
        columnId: 'id',
        getValue: (row) => row.id,
        options: { sortable: true },
        _meta: {
            filterType: 'number'
        }
    }),
    createAccessorColumn({
        header: 'First Name',
        accessorKey: 'firstName',
        columnId: 'firstName',
        getValue: (row) => row.firstName,
        options: { sortable: true },
        _meta: {
            filterType: 'text'
        }
    }),

    createAccessorColumn({
        header: 'Age',
        columnId: 'age',
        accessorKey: 'profile.age',
        getValue: (row) => row.profile.age,
        options: { sortable: true },
        _meta: {
            filterType: 'number'
        },
        getGroupValue: (row) => {
            const age = row.profile?.age;
            // Optional: You can bucket ages into ranges if needed
            return age !== undefined && age !== null 
                ? Math.floor(age / 10) * 10 + '-' + (Math.floor(age / 10) * 10 + 9)
                : 'Unknown';
        },
    }),
    // Computed column for full name
    createComputedColum({
        header: 'Full Name',
        columnId: 'fullName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
 
        getValue: (row) => `${row.firstName} ${row.lastName}`,
        options: { sortable: true },
        getGroupValue: (row) => {
            const fullName = `${row.firstName} ${row.lastName}`;
            // Optional: Group by first letter or first word
            return fullName.charAt(0).toUpperCase();
        },
        
    }),

    // Conditional formatting for status
    createAccessorColumn({
        header: 'Status',
        columnId: 'status',
        accessorKey: 'status',
        // cell: (row) => `<span class="${row?.status}">${row?.status.toUpperCase()}</span>`,
        getValue: (row) => row.status,
        options: { sortable: true },
        _meta: {
            filterType: 'select',
            filterOptions: [{label: 'active', value: 'active'}, {label:'inactive', value: 'inactive'}, {label: 'pending', value: 'pending'}]
        }
    }),

    // Grouped columns for profile
    createColumnGroup({
        header: 'Profile',
        columns: [
            createAccessorColumn({
                header: 'Email',
                columnId: 'email',
                accessorKey: 'profile.email',
                getValue: (row) => row.profile.email,
                options: {
                    sortable: true
                }
            }),
            createAccessorColumn({
                header: 'Country',
                columnId: 'country',
                accessorKey: 'profile.country',
                getValue: (row) => row.profile.country,
                options: {
                    sortable: true
                }
            })
        ]
    }),

    // Grouped columns for stats
    createColumnGroup({
        header: 'Stats',
        columns: [
            createAccessorColumn({
                header: 'Visits',
                columnId: 'visits',
                accessorKey: 'stats.visits',
                getValue: (row) => row.stats.visits,
                options: { sortable: true }
            }),
            createComputedColum({
                header: 'Last Login',
                columnId: 'lastLogin',
                accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                getValue: (row) => row.stats.lastLogin,
                options: { sortable: true }
            }),
            createAccessorColumn({
                header: 'Avg. Session (mins)',
                columnId: 'averageSessionDuration',
                accessorKey: 'stats.averageSessionDuration',
                getValue: (row) => row.stats.averageSessionDuration,
                options: { sortable: true }
            })
        ]
    }),
    // Role column with custom formatting
    createAccessorColumn({
        header: 'Role',
        columnId: 'role',
        accessorKey: 'role',
        getValue: (row) => row.role,
        // cell: (row) => `<span class="badge role-${row.role}">${row.role.toUpperCase()}</span>`,
        options: { sortable: true },
        _meta: {
            filterType: 'text'
        }
    })
];