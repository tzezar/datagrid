import { createColumnGroup } from "../column-creation/group-column-creator";
import type { AnyColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId, FilterableColumn, FilterOperator, GridBasicRow, GridRowIdentifier, LeafColumn, PinningPosition } from "../types";
import { findColumnById, flattenColumns, generateRandomColumnId, isColumnFilterable, isGroupRow } from "../utils.svelte";



export class HandlersManager {
    datagrid: DataGrid<any>;

    constructor(datagrid: DataGrid<any>) {
        this.datagrid = datagrid;
    }

    sorting = {
        toggleColumnSorting: (column: LeafColumn<any>, multisort: boolean) => {
            const datagrid = this.datagrid;
            const columnId = column.columnId;

            if (!column.options.sortable) return;


            const isColumnSorted = datagrid.features.sorting.isColumnSorted(columnId);
            const isColumnSortedAscending = datagrid.features.sorting.isColumnSorted(columnId, false);

            const singleColumnSort = () => {

                if (!isColumnSorted) {
                    this.datagrid.features.sorting.clearSorting();
                    this.datagrid.features.sorting.addSortConfig(columnId, false)
                }
                else if (isColumnSortedAscending) {
                    this.datagrid.features.sorting.clearSorting();
                    datagrid.features.sorting.addSortConfig(columnId, true);
                }
                else this.datagrid.features.sorting.clearSorting();

            }

            const multipleColumnSort = () => {
                if (!isColumnSorted) {
                    datagrid.features.sorting.addSortConfig(columnId, false);
                } else if (isColumnSortedAscending) {
                    datagrid.features.sorting.changeDirection(columnId, true);
                } else {
                    datagrid.features.sorting.removeSortConfig(columnId);

                }
            }

            if (multisort) multipleColumnSort();
            else singleColumnSort();

            datagrid.processors.data.executeFullDataTransformation();
        },


        sortColumnAscending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, false);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, true);

            this.datagrid.processors.data.executeFullDataTransformation();
        },

        sortColumnDescending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, true);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, false);

            this.datagrid.processors.data.executeFullDataTransformation();
        },


        sortColumn: (column: LeafColumn<any>, desc: boolean) => {
            if (desc) {
                const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, true);
                else this.datagrid.features.sorting.addSortConfig(column.columnId, true);
            } else {
                const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.features.sorting.changeDirection(column.columnId, false);
                else this.datagrid.features.sorting.addSortConfig(column.columnId, false);
            }
            this.datagrid.processors.data.executeFullDataTransformation();
        },


        unSortColumn: (column: LeafColumn<any>) => {
            this.datagrid.features.sorting.removeSortConfig(column.columnId);
            this.datagrid.processors.data.executeFullDataTransformation();
        }

    }
    filtering = {
        changeFilterOperator: (columnId: string, operator: FilterOperator) => {
            this.datagrid.features.filtering.changeConditionOperator(columnId, operator);
            this.datagrid.cache.invalidate('filteredData');
            this.datagrid.processors.data.executeFullDataTransformation();
        },

        updateFilterCondition: (props: {
            column: AnyColumn<any>,
            value: any,
        }) => {
            const { value } = props;
            let column = isColumnFilterable(props.column);
            if (column === null) return;
            column = column as FilterableColumn<any>

            if (!column) return;
            // Find existing condition
            const conditionIndex = this.datagrid.features.filtering.conditions.findIndex(c => c.columnId === column.columnId);

            if (value === '' || value === null || value === undefined) {
                // If value is empty, remove the condition (do not filter)
                if (conditionIndex > -1) {
                    this.datagrid.features.filtering.conditions.splice(conditionIndex, 1);
                }
                return;
            }

            if (conditionIndex === -1) {
                // If condition doesn't exist, add a new one
                this.datagrid.features.filtering.conditions.push({
                    columnId: column.columnId,
                    operator: 'equals',
                    getValueFn: column.getValueFn,
                    value
                });
            } else {
                // Update existing condition value
                this.datagrid.features.filtering.conditions[conditionIndex].value = value;
            }
        }
    }
    grouping = {
        change: (values: string[]) => {

            const newGroupBy: ColumnId[] = values
                .map((option) => {
                    const column = findColumnById(this.datagrid.columns, option);
                    if (!column) return null;
                    if (column.options.groupable === false) return null;
                    return option;
                })
                .filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

            this.datagrid.features.grouping.groupByColumns = newGroupBy;
            this.datagrid.features.pagination.goToFirstPage();
            this.datagrid.cache.invalidateGroupedRowsCache();
            this.datagrid.processors.data.executeFullDataTransformation();
        },
        toggle: (columnId: ColumnId) => {
            const column = findColumnById(this.datagrid.columns, columnId);
            if (!column) return;
            if (column.options.groupable === false) return;

            if (this.datagrid.features.grouping.groupByColumns.includes(columnId)) {
                this.datagrid.features.grouping.groupByColumns = this.datagrid.features.grouping.groupByColumns.filter((id) => id !== columnId);
            } else {
                this.datagrid.features.grouping.groupByColumns = [...this.datagrid.features.grouping.groupByColumns, columnId];
            }
            this.datagrid.features.pagination.goToFirstPage();
            this.datagrid.cache.invalidateGroupedRowsCache();
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }
    columnPinning = {
        pinColumn: (columnId: string, position: PinningPosition) => {
            const column = findColumnById(this.datagrid.columns, columnId);
            if (!column) return;
            column.state.pinning.position = position;
        },
        changeColumnPinningPosition: (columnId: string, position: PinningPosition) => {
            const column = findColumnById(this.datagrid.columns, columnId);
            if (!column) throw new Error(`Column ${columnId} not found`);
            this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
        }
    }
    columnOrdering = {
        moveLeft: (columnId: ColumnId) => {
            this.datagrid.features.columnOrdering.moveLeft(columnId);
        },
        moveRight: (columnId: ColumnId) => {
            this.datagrid.features.columnOrdering.moveRight(columnId)
        },
        moveColumnToGroup: ({ columnId, targetGroupColumnId }: { columnId: ColumnId, targetGroupColumnId: string }) => {
            this.datagrid.features.columnOrdering.moveColumnToPosition({ columnId, targetGroupColumnId });
        }
    }
    columnGrouping = {
        createGroup: ({ newGroupName, selectedColumns }: { newGroupName: string, selectedColumns: Record<string, boolean> }) => {
            const groupColumn = createColumnGroup({
                header: newGroupName,
                columnId: generateRandomColumnId(),
                parentColumnId: null,
                columns: []
            });
            this.datagrid.columns.push(groupColumn);

            this.datagrid.processors.column.refreshColumnPinningOffsets();

            const columnIdsToBeGrouped = Object.entries(selectedColumns)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, selected]) => selected)
                .map(([columnId]) => columnId);

            for (const columnId of columnIdsToBeGrouped) {
                const column = findColumnById(flattenColumns(this.datagrid.columns), columnId);
                if (!column) throw new Error(`Column ${columnId} not found`);
                column.parentColumnId = groupColumn.columnId;
            }
        }
    }
    rowSelection = {
        selectRowsOnPage: () => {
            const rowsOnPage = (this.datagrid.cache.paginatedRows || []).filter(row => !isGroupRow(row)) as GridBasicRow<any>[];
            const ids = rowsOnPage.map(row => row.identifier);
            this.datagrid.features.rowSelection.selectRows(ids);
        },
        unselectRowsOnPage: () => {
            const rowsOnPage = (this.datagrid.cache.paginatedRows || []).filter(row => !isGroupRow(row)) as GridBasicRow<any>[];
            const ids = rowsOnPage.map(row => row.identifier);
            this.datagrid.features.rowSelection.unselectRows(ids);
        },
        selectAllRows: () => {
            const rows = (this.datagrid.cache.rows || []).filter(row => !isGroupRow(row)) as GridBasicRow<any>[];
            const ids = rows.map(row => row.identifier);
            this.datagrid.features.rowSelection.selectRows(ids);
        },
        unselectAllRows: () => {
            const rows = (this.datagrid.cache.rows || []).filter(row => !isGroupRow(row)) as GridBasicRow<any>[];
            const ids = rows.map(row => row.identifier);
            this.datagrid.features.rowSelection.unselectRows(ids);
        }

    }
    rowPinning = {
        pinRowTop: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowPinning.pinRowTop(rowIdentifier);
        },
        pinRowBottom: (rowIdentifier: GridRowIdentifier) => {
            this.datagrid.features.rowPinning.pinRowBottom(rowIdentifier);
        }
    }
}
