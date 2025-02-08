import type { ColumnId } from "../types";
import { BaseService } from "./base-service";

export class GroupingService extends BaseService {
    updateGrouping(values: string[]) {
        const validGroupColumns: ColumnId[] = values
            .map((option) => {
                const column = this.datagrid.columns.findColumnById(option);
                if (!column) return null;
                if (column.options.groupable === false) return null;
                return option;
            })
            .filter((columnId): columnId is ColumnId => columnId !== null);

        this.datagrid.features.grouping.activeGroups = validGroupColumns;
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    toggleGrouping(columnId: ColumnId) {
        const column = this.datagrid.columns.findColumnById(columnId);
        if (!column) return;
        if (column.options.groupable === false) return;

        const { activeGroups } = this.datagrid.features.grouping;

        this.datagrid.features.grouping.activeGroups = activeGroups.includes(columnId)
            ? activeGroups.filter((id) => id !== columnId)
            : [...activeGroups, columnId];

        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}