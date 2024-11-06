import type { Row } from "$lib/datagrid/processors/data-processor.svelte";
import type { ColumnDef, Data } from "$lib/datagrid/types";
import Profit from "./cells/profit.svelte";
import RowSelection from "./cells/row-selection.svelte";

export const columns = [
    {
        accessorKey: 'selection',
        header: 'Selection',
        filterable: false,
        sortable: false,
        groupable: false,
        cell: {
            component: RowSelection
        },
    },
    {
        accessorKey: 'id',
        header: 'ID',
        pinning: 'left',
        groupable: false,
        _meta: {
            type: 'number',
            operators: ['equals', 'greaterThan', 'lessThan']
        }
    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        pinning: 'left',
        _meta: {
            type: 'string',
            operators: ['contains', 'equals']
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
        cell: {
            style: (row: Row) => `${row?.original?.region === 'East' ? 'color: orange' : ''}`
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
        accessorKey: 'sales',
        header: 'Sales',
        pinnable: false,
        resizable: false,
        groupable: false,
        movable: false,
        hideable: false,
        filterable: false,
        formatter: (row: Data) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        // faceting: {
        //     type: 'numeric',
        //     max: 0,
        //     min: 0
        // },
        _meta: {
            type: 'number',
            operators: ['contains', 'equals']
        }
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        groupable: false,
        cell: {
            component: Profit
        },
        // faceting: {
        //     type: 'numeric',
        //     max: 0,
        //     min: 0
        // },
        _meta: {
            type: 'number',
            operators: ['equals', 'greaterThan', 'lessThan', 'between']
        }
    }
] satisfies ColumnDef[]