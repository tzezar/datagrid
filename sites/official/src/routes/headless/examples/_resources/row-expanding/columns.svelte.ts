import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn, displayColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";
import CellActions from "./cell-actions.svelte";



export const userColumns: AnyColumn<User>[] = [
    displayColumn({
        header: 'Actions',
        columnId: 'actions',
        headerCell: () => `&nbsp;`,
        cell: () => {
            return {
                component: CellActions,
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