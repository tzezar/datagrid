import type { ColumnId } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";
import { BaseService } from "./base-service";

export class GroupingService extends BaseService {
    updateGrouping(values: string[]) {
        const validGroupColumns: ColumnId[] = values
            .map((option) => {
                const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), option);
                if (!column) return null;
                if (column.options.groupable === false) return null;
                return option;
            })
            .filter((columnId): columnId is ColumnId => columnId !== null);

        this.datagrid.features.grouping.activeGroups = validGroupColumns;
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();
            
        this.datagrid.events.emit('onGroupingChange', { activeGroups: validGroupColumns });
    }

    toggleGrouping(columnId: ColumnId) {
        const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid._columns), columnId);
        if (!column) return;
        if (column.options.groupable === false) return;

        const { activeGroups } = this.datagrid.features.grouping;

        this.datagrid.features.grouping.activeGroups = activeGroups.includes(columnId)
            ? activeGroups.filter((id) => id !== columnId)
            : [...activeGroups, columnId];

        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();

        this.datagrid.events.emit('onGroupingChange', { activeGroups: this.datagrid.features.grouping.activeGroups });
    }
}