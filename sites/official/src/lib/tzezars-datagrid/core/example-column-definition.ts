import { createAccessorColumn, createColumn, createColumnGroup, createDisplayColumn, type ColumnDef } from "./column-creators";

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
    createColumn('First Name', 'firstName', { 
        sortable: true 
    }),

    // Nested property access - will suggest all nested paths
    createColumn('Age', 'profile.age'),

    // Computed column with type checking
    createAccessorColumn(
        'Full Name',
        (row) => `${row.firstName} ${row.lastName}`,
        { sortable: true }
    ),

    // Display column with type-safe row access
    createDisplayColumn(
        'Status',
        (info) => `
            <span class="${info.row.original.status}">
                ${info.row.original.status}
            </span>
        `
    ),

    // Grouped columns
    createColumnGroup('Profile', [
        createColumn('Email', 'profile.email'),
        createAccessorColumn(
            'Last Active',
            (row) => row.stats.lastLogin.toLocaleDateString()
        )
    ])
];