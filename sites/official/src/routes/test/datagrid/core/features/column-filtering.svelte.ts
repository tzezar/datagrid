import type { AnyColumn } from "../helpers/column-creators";
import type { FilterableColumn, FilterCondition, FilterOperator } from "../types";
import { isColumnFilterable } from "../utils.svelte";



export class ColumnFilteringFeature<TOriginalRow> {
    conditions: FilterCondition<TOriginalRow>[] = $state([])

    getConditionValue(columnId: string): any {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition ? condition.value : null;
    }

    getConditionOperator(columnId: string): FilterOperator | undefined {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition?.operator;
    }

    updateFilterCondition(props: {
        column: AnyColumn<TOriginalRow>,
        value: any,
    }) {
        const { value } = props;
        let column = isColumnFilterable(props.column);
        if (column === null) return;
        column = column as FilterableColumn<TOriginalRow>

        if (!column) return;
        // Find existing condition
        const conditionIndex = this.conditions.findIndex(c => c.columnId === column.columnId);

        if (value === '' || value === null || value === undefined) {
            // If value is empty, remove the condition (do not filter)
            if (conditionIndex > -1) {
                this.conditions.splice(conditionIndex, 1);
            }
            return;
        }

        if (conditionIndex === -1) {
            // If condition doesn't exist, add a new one
            this.conditions.push({
                columnId: column.columnId,
                operator: 'equals',
                getValueFn: column.getValueFn,
                value
            });
        } else {
            // Update existing condition value
            this.conditions[conditionIndex].value = value;
        }
    }


    evaluateCondition(cellValue: any, condition: FilterCondition<TOriginalRow>): boolean {
        const value = condition.value;
        const valueTo = condition.valueTo;

        // Handle null/undefined cell values
        if (cellValue === null || cellValue === undefined) {
            return condition.operator === 'empty';
        }

        // Convert to string for string operations
        const stringCellValue = String(cellValue).toLowerCase();
        const stringValue = String(value).toLowerCase();

        switch (condition.operator) {
            case 'equals':
                return cellValue === value;

            case 'notEquals':
                return cellValue !== value;

            case 'contains':
                return stringCellValue.includes(stringValue);

            case 'notContains':
                return !stringCellValue.includes(stringValue);

            case 'startsWith':
                return stringCellValue.startsWith(stringValue);

            case 'endsWith':
                return stringCellValue.endsWith(stringValue);

            case 'greaterThan':
                return cellValue > value;

            case 'lessThan':
                return cellValue < value;

            case 'greaterThanOrEqual':
                return cellValue >= value;

            case 'lessThanOrEqual':
                return cellValue <= value;

            case 'between':
                if (valueTo === undefined) throw new Error('Between filter requires a second value');
                return cellValue >= value && cellValue <= valueTo;

            case 'inList':
                return Array.isArray(value) && value.includes(cellValue);

            case 'notInList':
                return Array.isArray(value) && !value.includes(cellValue);

            case 'empty':
                return cellValue === '' || cellValue === null || cellValue === undefined;

            case 'notEmpty':
                return cellValue !== '' && cellValue !== null && cellValue !== undefined;

            default:
                return true;
        }
    }
}
