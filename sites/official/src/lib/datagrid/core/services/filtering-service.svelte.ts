import type { FilterableColumn, FilterOperator, LeafColumn } from "../types";
import { BaseService } from "./base-service";

export class FilteringService extends BaseService {
    changeFilterOperator(columnId: string, operator: FilterOperator) {
        this.datagrid.features.filtering.changeConditionOperator(columnId, operator);
        this.datagrid.cacheManager.invalidate('filteredData');
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    updateFilterCondition(props: {
        column: LeafColumn<any>,
        value: any,
        valueTo?: any, // Optional second value for range-based filters like 'between'
        operator: FilterOperator, // Add operator to the props
    }) {
        this.datagrid.events.emit('onFilterChange', { column: props.column });
    
        const { value, operator, valueTo } = props;
        let column = props.column;
    
        if (column === null || !column.isFilterable()) return;
        column = column as FilterableColumn<any>;
    
        if (!column) return;
    
        // Find existing condition
        const conditionIndex = this.datagrid.features.filtering.filterConditions.findIndex(c => c.columnId === column.columnId);
    
        if (conditionIndex === -1) {
            // If condition doesn't exist, add a new one
            this.datagrid.features.filtering.filterConditions.push({
                columnId: String(column.columnId),
                operator, // Set the operator here
                getValueFn: column.getValueFn,
                value,
                valueTo // Add the second value for 'between' filter
            });
        } else {
            // Update existing condition with the new value and operator
            this.datagrid.features.filtering.filterConditions[conditionIndex].value = value;
            this.datagrid.features.filtering.filterConditions[conditionIndex].operator = operator;
            if (valueTo !== undefined) {
                this.datagrid.features.filtering.filterConditions[conditionIndex].valueTo = valueTo;
            }
        }
        console.log($state.snapshot(this.datagrid.features.filtering.filterConditions));

        this.datagrid.cacheManager.invalidate('filteredData');
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}