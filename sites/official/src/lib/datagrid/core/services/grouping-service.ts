import type { ColumnId } from "../types";
import { BaseService } from "./base-service";

export class GroupingService extends BaseService {
    change(values: string[]) {

        const newGroupBy: ColumnId[] = values
            .map((option) => {
                const column = this.datagrid.columns.findColumnById(option);
                if (!column) return null;
                if (column.options.groupable === false) return null;
                return option;
            })
            .filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

        this.datagrid.features.grouping.groupByColumns = newGroupBy;
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();
    }
    toggle(columnId: ColumnId) {
        const column = this.datagrid.columns.findColumnById(columnId);
        if (!column) return;
        if (column.options.groupable === false) return;

        if (this.datagrid.features.grouping.groupByColumns.includes(columnId)) {
            this.datagrid.features.grouping.groupByColumns = this.datagrid.features.grouping.groupByColumns.filter((id) => id !== columnId);
        } else {
            this.datagrid.features.grouping.groupByColumns = [...this.datagrid.features.grouping.groupByColumns, columnId];
        }
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidateGroupedRowsCache();
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}