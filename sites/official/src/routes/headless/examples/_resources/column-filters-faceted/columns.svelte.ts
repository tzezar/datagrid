import type { User } from "$lib/data-generators/generate/user";
import { accessorColumn } from "$lib/datagrid/core/column-creation";
import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";



export const userColumns: AnyColumn<User>[] = [
    
    accessorColumn({
        header: 'First Name',
        accessorKey: 'firstName',
        _meta: {
            filterType: 'text'
        }
    }),
    accessorColumn({
        header: 'Last Name',
        accessorKey: 'lastName',
        _meta: {
            filterType: 'text'
        }
    }),
    accessorColumn({
        header: "Age",
        accessorKey: 'profile.age',
        _meta: {
            filterType: 'number'
        }
    }),

]