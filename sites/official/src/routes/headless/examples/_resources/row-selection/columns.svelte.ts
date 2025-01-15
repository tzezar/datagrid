import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn, displayColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/types";
import CellSelectRow from "./cell-select-row.svelte";



export const userColumns: AnyColumn<User>[] = [
    displayColumn({
        header: 'Select row',
        columnId: 'select',
        headerCell: () => `&nbsp;`,
        cell: () => {
            return {
                component: CellSelectRow,
            }
        },
        state: {
            size: {
                width: 30,
                minWidth: 30,
                maxWidth: 60,
            }
        },
    }),
    accessorColumn({
        header: 'First Name',
        accessorKey: 'firstName',
    }),
    accessorColumn({
        header: 'Last Name',
        accessorKey: 'lastName',
    }),

]