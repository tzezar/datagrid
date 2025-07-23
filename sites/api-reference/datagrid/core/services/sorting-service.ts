import type { LeafColumn } from "../types";
import { BaseService } from "./base-service";

/**
 * Interface for sorting-related services in a data grid.
 */
export type ISortingService = {
    /**
     * Toggles the sorting of a column.
     * 
     * @param {LeafColumn<any>} column The column to toggle sort for.
     * @param {boolean} multisort Whether to apply multi-column sorting.
     */
    toggleColumnSort(column: LeafColumn<any>, multisort: boolean): void;

    /**
     * Applies an ascending sort to a column.
     * 
     * @param {LeafColumn<any>} column The column to apply ascending sort to.
     */
    applyAscendingSort(column: LeafColumn<any>): void;

    /**
     * Applies a descending sort to a column.
     * 
     * @param {LeafColumn<any>} column The column to apply descending sort to.
     */
    applyDescendingSort(column: LeafColumn<any>): void;

    /**
     * Clears the sort for a given column.
     * 
     * @param {LeafColumn<any>} column The column to clear the sort for.
     */
    clearColumnSort(column: LeafColumn<any>): void;
}

/**
 * Class responsible for managing column sorting in a data grid.
 * 
 * @extends BaseService
 */
export class SortingService extends BaseService {

    /**
     * Toggles the sorting direction of a column (ascending/descending) or clears the sort.
     * 
     * @param {LeafColumn<any>} column The column to toggle sort for.
     * @param {boolean} multisort Whether to apply multi-column sorting.
     */
    toggleColumnSort(column: LeafColumn<any>, multisort: boolean) {
        const datagrid = this.datagrid;
        const columnId = column.columnId;

        datagrid.events.emit('onColumnSort', { column, multisort });

        if (!column.options.sortable) return;

        const isColumnSorted = datagrid.features.sorting.isColumnSorted(columnId);
        const isColumnSortedAscending = datagrid.features.sorting.isColumnSorted(columnId, 'ascending');

        const applySingleColumnSort = () => {
            if (!isColumnSorted) {
                this.datagrid.features.sorting.clearSortConfigs();
                this.datagrid.features.sorting.addSortConfig(columnId, 'ascending');
            }
            else if (isColumnSortedAscending) {
                this.datagrid.features.sorting.clearSortConfigs();
                datagrid.features.sorting.addSortConfig(columnId, 'descending');
            }
            else this.datagrid.features.sorting.clearSortConfigs();
        }

        const applyMultiColumnSort = () => {
            if (!isColumnSorted) {
                const isOverMaxColCount = datagrid.features.sorting.sortConfigs.length >= datagrid.features.sorting.maxMultiSortColumns;
                if (isOverMaxColCount) {
                    // remove first sorting config
                    if (datagrid.features.sorting.sortConfigs.length > 0) {
                        datagrid.features.sorting.removeSortConfig(datagrid.features.sorting.sortConfigs[0]!.columnId);
                    }
                }

                datagrid.features.sorting.addSortConfig(columnId, 'ascending');
            } else if (isColumnSortedAscending) {
                datagrid.features.sorting.changeSortConfigDirection(columnId, 'descending');
            } else {
                datagrid.features.sorting.removeSortConfig(columnId);
            }
        }

        if (multisort) applyMultiColumnSort();
        else applySingleColumnSort();

        datagrid.cacheManager.invalidate('sortedData');
        datagrid.processors.data.executeFullDataTransformation();
        datagrid.features.sorting.onSortingChange(datagrid.features.sorting);
    }

    /**
     * Applies an ascending sort to the specified column.
     * 
     * @param {LeafColumn<any>} column The column to apply ascending sort to.
     */
    applyAscendingSort(column: LeafColumn<any>) {
        this.datagrid.events.emit('onColumnSort', { column });

        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, 'ascending');
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'ascending');

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    /**
     * Applies a descending sort to the specified column.
     * 
     * @param {LeafColumn<any>} column The column to apply descending sort to.
     */
    applyDescendingSort(column: LeafColumn<any>) {
        this.datagrid.events.emit('onColumnSort', { column });

        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, 'descending');
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'descending');

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    /**
     * Clears the sort configuration for a specified column.
     * 
     * @param {LeafColumn<any>} column The column to clear the sort for.
     */
    clearColumnSort(column: LeafColumn<any>) {
        this.datagrid.events.emit('onColumnSort', { column });

        this.datagrid.features.sorting.removeSortConfig(column.columnId);
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}
