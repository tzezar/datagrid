import type { LeafColumn } from "../types";
import { BaseService } from "./base-service";

export class SortingService extends BaseService {
    toggleColumnSort(column: LeafColumn<any>, multisort: boolean) {
        this.events.emit('toggleSort', { column, multisort });

        const datagrid = this.datagrid;
        const columnId = column.columnId;

        if (!column.options.sortable) return;


        const isColumnSorted = datagrid.features.sorting.isColumnSorted(columnId);
        const isColumnSortedAscending = datagrid.features.sorting.isColumnSorted(columnId, 'asc');

        const applySingleColumnSort = () => {
            if (!isColumnSorted) {
                this.datagrid.features.sorting.clearSortConfigs();
                this.datagrid.features.sorting.addSortConfig(columnId, 'asc')
            }
            else if (isColumnSortedAscending) {
                this.datagrid.features.sorting.clearSortConfigs();
                datagrid.features.sorting.addSortConfig(columnId, 'desc');
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

                datagrid.features.sorting.addSortConfig(columnId, 'asc');
            } else if (isColumnSortedAscending) {
                datagrid.features.sorting.changeSortConfigDirection(columnId, true);
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
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, false);
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'asc');

        this.datagrid.processors.data.executeFullDataTransformation();
    }


    applyDescendingSort(column: LeafColumn<any>) {
        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, true);
        else this.datagrid.features.sorting.addSortConfig(column.columnId, 'desc');

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    clearColumnSort(column: LeafColumn<any>) {
        this.datagrid.features.sorting.removeSortConfig(column.columnId);
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}