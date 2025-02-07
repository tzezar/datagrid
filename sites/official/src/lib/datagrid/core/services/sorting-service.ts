import type { LeafColumn } from "../types";
import { BaseService } from "./base-service";

export class SortingService extends BaseService {
    toggleSort(column: LeafColumn<any>, multisort: boolean) {
        this.events.emit('toggleSort', { column, multisort });

        const datagrid = this.datagrid;
        const columnId = column.columnId;

        if (!column.options.sortable) return;


        const isColumnSorted = datagrid.features.sorting.isColumnSorted(columnId);
        const isColumnSortedAscending = datagrid.features.sorting.isColumnSorted(columnId, false);

        const singleColumnSort = () => {
            if (!isColumnSorted) {
                this.datagrid.features.sorting.clearSortConfigs();
                this.datagrid.features.sorting.addSortConfig(columnId, false)
            }
            else if (isColumnSortedAscending) {
                this.datagrid.features.sorting.clearSortConfigs();
                datagrid.features.sorting.addSortConfig(columnId, true);
            }
            else this.datagrid.features.sorting.clearSortConfigs();

        }

        const multipleColumnSort = () => {
            if (!isColumnSorted) {
                const isOverMaxColCount = datagrid.features.sorting.sortConfigs.length >= datagrid.features.sorting.maxMultiSortColumns;
                if (isOverMaxColCount) {
                    // remove first sorting config
                    console.log('removing first sorting config');
                    datagrid.features.sorting.removeSortConfig(datagrid.features.sorting.sortConfigs[0].columnId);
                }

                datagrid.features.sorting.addSortConfig(columnId, false);
            } else if (isColumnSortedAscending) {
                datagrid.features.sorting.changeSortConfigDirection(columnId, true);
            } else {
                datagrid.features.sorting.removeSortConfig(columnId);

            }
        }

        if (multisort) multipleColumnSort();
        else singleColumnSort();

        datagrid.cacheManager.invalidate('sortedData');
        datagrid.processors.data.executeFullDataTransformation();

        datagrid.features.sorting.onSortingChange(datagrid.features.sorting);
    }

    sortColumnAscending(column: LeafColumn<any>) {
        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, false);
        else this.datagrid.features.sorting.addSortConfig(column.columnId, true);

        this.datagrid.processors.data.executeFullDataTransformation();
    }


    sortColumnDescending(column: LeafColumn<any>) {
        const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
        if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, true);
        else this.datagrid.features.sorting.addSortConfig(column.columnId, false);

        this.datagrid.processors.data.executeFullDataTransformation();
    }


    sortColumn(column: LeafColumn<any>, desc: boolean) {
        if (desc) {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, true);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, true);
        } else {
            const isColumnSorted = this.datagrid.features.sorting.isColumnSorted(column.columnId);
            if (isColumnSorted) this.datagrid.features.sorting.changeSortConfigDirection(column.columnId, false);
            else this.datagrid.features.sorting.addSortConfig(column.columnId, false);
        }
        this.datagrid.processors.data.executeFullDataTransformation();
    }


    unSortColumn(column: LeafColumn<any>) {
        this.datagrid.features.sorting.removeSortConfig(column.columnId);
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}