import type { AnyColumn } from "../column-creation/types";
import type { Datagrid } from "../index.svelte";
import type { ColumnId, FilterableColumn, LeafColumn, PinningPosition } from "../types";
import { findColumnById, isColumnFilterable } from "../utils.svelte";



export class HandlersManager {
    datagrid: Datagrid<any>;

    constructor(datagrid: Datagrid<any>) {
        this.datagrid = datagrid;
    }


    sorting = {
        toggleColumnSorting: (column: LeafColumn<any>, event: MouseEvent) => {
            const datagrid = this.datagrid;
            const columnId = column.columnId;

            if (!column.options.sortable) return;

            const isUserMultiSorting = event.shiftKey;

            const isColumnSorted = datagrid.sorting.isColumnSorted(columnId);
            const isColumnSortedAscending = datagrid.sorting.isColumnSorted(columnId, false);

            const singleColumnSort = () => {
                if (!isColumnSorted) this.datagrid.sorting.addSortConfig(columnId, false);
                else if (isColumnSortedAscending) this.datagrid.sorting.changeDirection(columnId, true);
                else this.datagrid.sorting.clearSorting();

            }

            const multipleColumnSort = () => {
                if (!isColumnSorted) {
                    datagrid.sorting.addSortConfig(columnId, false);
                } else if (isColumnSortedAscending) {
                    datagrid.sorting.changeDirection(columnId, true);
                } else {
                    datagrid.sorting.removeSortConfig(columnId);

                }
            }

            if (isUserMultiSorting) multipleColumnSort();
            else singleColumnSort();

            datagrid.processors.data.executeFullDataTransformation();
        },


        sortColumnAscending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.sorting.changeDirection(column.columnId, false);
            else this.datagrid.sorting.addSortConfig(column.columnId, true);

            this.datagrid.processors.data.executeFullDataTransformation();
        },

        sortColumnDescending: (column: LeafColumn<any>) => {
            const isColumnSorted = this.datagrid.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.sorting.changeDirection(column.columnId, true);
            else this.datagrid.sorting.addSortConfig(column.columnId, false);

            this.datagrid.processors.data.executeFullDataTransformation();
        },


        sortColumn: (column: LeafColumn<any>, desc: boolean) => {
            if (desc) {
                const isColumnSorted = this.datagrid.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.sorting.changeDirection(column.columnId, true);
                else this.datagrid.sorting.addSortConfig(column.columnId, true);
            } else {
                const isColumnSorted = this.datagrid.sorting.isColumnSorted(column.columnId);
                if (isColumnSorted) this.datagrid.sorting.changeDirection(column.columnId, false);
                else this.datagrid.sorting.addSortConfig(column.columnId, false);
            }
            this.datagrid.processors.data.executeFullDataTransformation();
        },


        unSortColumn: (column: LeafColumn<any>) => {
            this.datagrid.sorting.removeSortConfig(column.columnId);
            this.datagrid.processors.data.executeFullDataTransformation();
        }

    }
    filtering = {
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
            const conditionIndex = this.datagrid.filtering.conditions.findIndex(c => c.columnId === column.columnId);

            if (value === '' || value === null || value === undefined) {
                // If value is empty, remove the condition (do not filter)
                if (conditionIndex > -1) {
                    this.datagrid.filtering.conditions.splice(conditionIndex, 1);
                }
                return;
            }

            if (conditionIndex === -1) {
                // If condition doesn't exist, add a new one
                this.datagrid.filtering.conditions.push({
                    columnId: column.columnId,
                    operator: 'equals',
                    getValueFn: column.getValueFn,
                    value
                });
            } else {
                // Update existing condition value
                this.datagrid.filtering.conditions[conditionIndex].value = value;
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

            this.datagrid.grouping.groupByColumns = newGroupBy;
            this.datagrid.pagination.goToFirstPage();
            this.datagrid.cache.invalidateGroupedRowsCache();
            this.datagrid.processors.data.executeFullDataTransformation();
        },
        toggle: (columnId: ColumnId) => {
            const column = findColumnById(this.datagrid.columns, columnId);
            if (!column) return;
            if (column.options.groupable === false) return;

            if (this.datagrid.grouping.groupByColumns.includes(columnId)) {
                this.datagrid.grouping.groupByColumns = this.datagrid.grouping.groupByColumns.filter((id) => id !== columnId);
            } else {
                this.datagrid.grouping.groupByColumns = [...this.datagrid.grouping.groupByColumns, columnId];
            }
            this.datagrid.pagination.goToFirstPage();
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
    }
    columnOrdering = {
        moveLeft: (columnId: ColumnId) => {
            this.datagrid.columnOrdering.moveLeft(columnId);
        },
        moveRight: (columnId: ColumnId) => {
            this.datagrid.columnOrdering.moveRight(columnId)
        }
    }
}
