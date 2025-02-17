import type { ColumnId } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";
import { BaseService } from "./base-service";

/**
 * Service for handling column grouping operations within the data grid,
 * including updating active groups and toggling grouping for specific columns.
 * 
 * @extends BaseService
 */
export class GroupingService extends BaseService {

    /**
     * Updates the active grouping columns based on the provided values.
     * Only columns that are groupable will be included.
     * 
     * @param {string[]} values An array of column identifiers to set as active groups.
     * Refreshes the data grid, recalculating the groups and resetting pagination.
     */
    updateGrouping(values: string[]) {
        const validGroupColumns: ColumnId[] = values
            .map((option) => {
                const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), option);
                if (!column) return null;
                if (column.options.groupable === false) return null;
                return option;
            })
            .filter((columnId): columnId is ColumnId => columnId !== null);

        const err = this.datagrid.features.grouping.updateActiveGroups(validGroupColumns);
        if (err) return;

        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();

        this.datagrid.events.emit('onGroupingChange', { activeGroups: validGroupColumns });
    }

    /**
     * Toggles the grouping for a specific column.
     * If the column is groupable, it will either add or remove the column from the active groups.
     * 
     * @param {ColumnId} columnId The identifier of the column to toggle grouping for.
     * Refreshes the data grid, recalculating the groups and resetting pagination.
     */
    toggleGrouping(columnId: ColumnId) {
        const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), columnId);
        if (!column) return;
        if (column.options.groupable === false) return;

        this.datagrid.features.grouping.toggleGrouping(columnId);
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();

        this.datagrid.events.emit('onGroupingChange', { activeGroups: this.datagrid.features.grouping.activeGroups });
    }
}
