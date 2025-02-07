import type { AnyColumn, FilterableColumn, FilterOperator } from "../types";
import { BaseService } from "./base-service";

export class FilteringService extends BaseService {
    changeFilterOperator(columnId: string, operator: FilterOperator) {
        this.datagrid.features.filtering.changeConditionOperator(columnId, operator);
        this.datagrid.cacheManager.invalidate('filteredData');
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    updateFilterCondition(props: {
        column: AnyColumn<any>,
        value: any,
    }) {
        // TODO this should be rewritten and placed somewhere else, maybe in filtering feature
        // TODO handle eg empty without value etc
        const { value } = props;
        let column = props.column
        if (column === null || !column.isFilterable()) return;
        column = column as FilterableColumn<any>

        if (!column) return;
        // Find existing condition
        const conditionIndex = this.datagrid.features.filtering.filterConditions.findIndex(c => c.columnId === column.columnId);

        // if (value === '' || value === null || value === undefined) {
        //     // If value is empty, remove the condition (do not filter)
        //     if (conditionIndex > -1) {
        //         this.datagrid.features.filtering.conditions.splice(conditionIndex, 1);
        //     }
        //     return;
        // }

        if (conditionIndex === -1) {
            // If condition doesn't exist, add a new one
            this.datagrid.features.filtering.filterConditions.push({
                columnId: String(column.columnId),
                operator: 'contains',
                getValueFn: column.getValueFn,
                value
            });
        } else {
            // Update existing condition value
            this.datagrid.features.filtering.filterConditions[conditionIndex].value = value;
        }
    }
}