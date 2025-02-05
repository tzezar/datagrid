import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/types";



export const basicColumns: AnyColumn<User>[] = [
    accessorColumn({
        header: 'First Name',
        accessorKey: 'firstName',
        state: {
            size: {
                width: 200,
                minWidth: 99,
                maxWidth: 400,
            }
        }
    }),
    accessorColumn({
        header: 'Last Name',
        accessorKey: 'lastName',
    }),
    accessorColumn({
        header: 'Age',
        accessorKey: 'profile.age',
    }),
    accessorColumn({
        accessorKey: 'profile.country',
        header: 'Country',
    })
] 