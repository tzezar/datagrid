import type { ColumnDef } from "$lib/tzezars-datagrid/core/types";
import type { SalesDataRow } from "$lib/generate-data/generate-sales-data";
import Actions from "./cells/actions.svelte";
import Profit from "./cells/profit.svelte";
import RowSelection from "./cells/row-selection.svelte";

type TableCustomKeys = 'actions' | 'selection';
export const columns = [
    {
        accessorKey: 'actions',
        header: 'Actions',
        filterable: false,
        sortable: false,
        groupable: false,
        cell: {
            component: Actions
        },
    },
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
            // style: (row) => `${row?.original?.region === 'East' ? 'color: orange' : ''}`
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
        formatter: (row) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
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
        aggregationFn: 'sum',
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
] satisfies ColumnDef<SalesDataRow, TableCustomKeys>[]
