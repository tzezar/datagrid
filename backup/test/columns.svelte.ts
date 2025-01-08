import { createAccessorColumn, type AnyColumn } from "$lib/datagrid/core/helpers/column-creators";
import type { User } from "./generate-users";


export const userColumns: AnyColumn<User>[] = [
    // Grouped columns for stats

    createAccessorColumn({
        header: 'First Name',
        columnId: 'firstName',
        accessorKey: 'firstName',
        getValueFn: (row) => row.stats.averageSessionDuration,
        options: { sortable: true, filterable: true },
        _meta: {
            filterType: 'number'
        }
    }),
    createAccessorColumn({
        header: 'Last Name',
        columnId: 'lastName',
        accessorKey: 'lastName',
        getValueFn: (row) => row.stats.averageSessionDuration,
        options: { sortable: true, filterable: true },
        _meta: {
            filterType: 'number'
        }
    }),
    

];