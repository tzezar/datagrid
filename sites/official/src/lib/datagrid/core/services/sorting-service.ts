import type { LeafColumn } from "../types";
import { BaseService } from "./base-service";


export type ISortingService = {
    toggleColumnSort(column: LeafColumn<any>, multisort: boolean): void
    applyAscendingSort(column: LeafColumn<any>): void
    applyDescendingSort(column: LeafColumn<any>): void
    clearColumnSort(column: LeafColumn<any>): void
}

export class SortingService extends BaseService {
    toggleColumnSort(column: LeafColumn<any>, multisort: boolean) {
        this.events.emit('toggleSort', { column, multisort });

        const datagrid = this.datagrid;
        const columnId = column.columnId;

        if (!column.options.sortable) return;


        const isColumnSorted = datagrid.features.sorting.isColumnSorted(columnId);
        const isColumnSortedAscending = datagrid.features.sorting.isColumnSorted(columnId, 'ascending');

        const applySingleColumnSort = () => {
            if (!isColumnSorted) {
                this.datagrid.features.sorting.clearSortConfigs();
                this.datagrid.features.sorting.addSortConfig(columnId, 'ascending')
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
                    console.log('removing first sorting config');
                    datagrid.features.sorting.removeSortConfig(datagrid.features.sorting.sortConfigs[0].columnId);
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

    applyAscendingSort(column: LeafColumn<any>) {
        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, 'ascending');
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'ascending');

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    applyDescendingSort(column: LeafColumn<any>) {
        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, 'descending');
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'descending');

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    clearColumnSort(column: LeafColumn<any>) {
        this.datagrid.features.sorting.removeSortConfig(column.columnId);
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}