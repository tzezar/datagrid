import { createComputedColum, createColumn, createColumnGroup, createDisplayColumn, type ColumnDef } from "./column-creators";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    profile: {
        age: number;
        email: string;
    };
    stats: {
        visits: number;
        lastLogin: Date;
    };
    status: 'active' | 'inactive';
}

// Example columns with full IntelliSense support
export const userColumns: ColumnDef<User>[] = [
    // Basic column - will suggest all possible keys from User interface
    createColumn({ header: "First Name", accessorKey: 'firstName', options: { sortable: true } }),
    createColumn({ header: 'Age', accessorKey: 'profile.age' }),

    // Computed column with type checking
    createComputedColum({
        header: 'Full Name',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        options: { sortable: true }
    }),

    // Display column with type-safe row access
    createDisplayColumn({
        header: 'Status',
        cell: (info) => `<span class="${info.row.original.status}">${info.row.original.status}</span>`,
        options: { sortable: true }
    }),

    // Grouped columns
    createColumnGroup({
        header: 'Profile', columns: [
            createColumn({ header: 'Email', accessorKey: 'profile.email' }),
            createComputedColum({ header: 'Last Active', accessorFn: (row) => row.stats.lastLogin.toLocaleDateString() })
        ]
    })
];