import type { ColumnDef } from "$lib/datagrid/types"
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data"

export const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        align: 'end',
        faceting: {
            type: 'numeric',
            max: 0,
            min: 0
        },
        _meta: {
            type: 'numeric-facet',
            currentOperator: 'between',
            operators: ['between']
        }
    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        size: {
            grow: true,
            width: -1,
            minWidth: 100,
            maxWidth: -1
        },
        faceting: {
            type: 'categorical',
            uniqueValues: [],
            uniqueValuesCount: 0
        },
        _meta: {
            type: 'select',
            operators: ['equals']
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
        faceting: {
            type: 'categorical',
            uniqueValues: [],
            uniqueValuesCount: 0
        },
        _meta: {
            type: 'select',
            operators: ['equals']
        }
    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        align: 'end',
        filterable: false,
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        align: 'end',
        filterable: false,
    }
] satisfies ColumnDef<SalesDataRow, string>[]

