import type { Row } from "$lib/datagrid/processors/data-processor.svelte";
import type { ColumnDef, Data } from "$lib/datagrid/types";
import Profit from "./cells/profit.svelte";
import RowSelection from "./cells/row-selection.svelte";

export const columns = [
    {
        accessorKey: 'selection',
        header: 'Selection',
        type: 'string',
        filterable: false,
        sortable: false,
        groupable: false,
        cell: {
            component: RowSelection
        }
    },
    {
        accessorKey: 'id',
        header: 'ID',
        type: 'number',
        pinning: {
            position: 'left',
        },

    },
    {
        accessorKey: 'department.name',
        header: 'Department',
        type: 'string',
        pinning: {
            position: 'left',
        }
    },

    {
        accessorKey: 'region',
        header: 'Region',
        cell: {
            style: (row: Row) => `${row?.original?.region === 'East' ? 'color: orange' : ''}`
        },
        // faceting: {
        //     type: 'categorical',
        //     uniqueValues: [],
        //     uniqueValuesCount: 0
        // },
        type: 'string',
        filter: 'select'

    },
    {
        accessorKey: 'sales',
        header: 'Sales',
        formatter: (row: Data) => row.sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        // faceting: {
        //     type: 'numeric',
        //     max: 0,
        //     min: 0
        // },
        type: 'number',
    },
    {
        accessorKey: 'profit',
        header: 'Profit',
        cell: {
            component: Profit
        },
        // faceting: {
        //     type: 'numeric',
        //     max: 0,
        //     min: 0
        // },
        type: 'number',
    }
] satisfies ColumnDef[]