import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn, displayColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";
import CellActions from "./cell-actions.svelte";



export const userColumns: AnyColumn<User>[] = [
    displayColumn({
        header: 'Select row',
        columnId: 'select',
        headerCell: () => `&nbsp;`,
        cell: () => {
            return {
                component: CellActions,
            }
        },
        state: {
            size: {
                width: 200,
                minWidth: 200,
                maxWidth: 200,
            }
        },
    }),
    accessorColumn({
        accessorKey: 'id',
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