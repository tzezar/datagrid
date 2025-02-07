import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/types";



export const userColumns: AnyColumn<User>[] = [

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