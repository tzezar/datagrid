import ActionsCell from "./_components/cells/cell-actions.svelte";
import CellRowPinning from "./_components/cells/cell-row-pinning.svelte";
import { createAccessorColumn, createColumnGroup, createComputedColumn, createDisplayColumn, type AnyColumn } from "../../../lib/datagrid/core/helpers/column-creators";
import SelectRowCell from "./_components/cells/cell-select-row.svelte";
import type { User } from "./generate-users";


export const userColumns: AnyColumn<User>[] = [
    // Grouped columns for stats
    createAccessorColumn({
        header: 'Avg. Session (mins)23',
        columnId: 'averageSessionDuration2',
        accessorKey: 'stats.averageSessionDuration',
        getValueFn: (row) => row.stats.averageSessionDuration,
        options: { sortable: true, filterable: true },
        _meta: {
            filterType: 'number'
        }
    }),
    createColumnGroup({
        header: 'Stats',
        columnId: 'stats',
        columns: [
            createAccessorColumn({
                header: 'Visits',
                columnId: 'visits',
                accessorKey: 'stats.visits',
                getValueFn: (row) => row.stats.visits,
                options: { sortable: true }
            }),
            createAccessorColumn({
                header: 'Visits2',
                columnId: 'visits2',
                accessorKey: 'stats.visits',
                getValueFn: (row) => row.stats.visits,
                options: { sortable: true }
            }),
            createColumnGroup({
                columnId: 'details',
                header: 'Details',
                columns: [
                    createComputedColumn({
                        header: 'Last Login',
                        columnId: 'lastLogin',
                        accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                        getValueFn: (row) => row.stats.lastLogin,
                        options: { sortable: true }
                    }),
                    createAccessorColumn({
                        header: 'Avg. Session (mins)',
                        columnId: 'averageSessionDuration',
                        accessorKey: 'stats.averageSessionDuration',
                        getValueFn: (row) => row.stats.averageSessionDuration,
                        options: { sortable: true, filterable: true },
                        _meta: {
                            filterType: 'number'
                        }
                    }),
                    createColumnGroup({
                        columnId: 'details2',
                        header: 'Details2',
                        columns: [
                            createComputedColumn({
                                header: 'Last Login2',
                                columnId: 'lastLogin2',
                                accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
                                getValueFn: (row) => row.stats.lastLogin,
                                options: { sortable: true }
                            }),
                            createAccessorColumn({
                                header: 'Avg. Session (mins)2',
                                columnId: 'averageSessionDuration2',
                                accessorKey: 'stats.averageSessionDuration',
                                getValueFn: (row) => row.stats.averageSessionDuration,
                                options: { sortable: true, filterable: true },
                                _meta: {
                                    filterType: 'number'
                                }
                            })
                        ]
                    }),
                ]
            }),

        ]
    }),

];