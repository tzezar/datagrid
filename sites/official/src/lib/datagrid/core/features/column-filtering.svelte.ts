import type { FilterCondition, FilterOperator } from "../types";


export type ColumnFilteringFeatureConfig = {
    conditions?: FilterCondition<any>[];
    manual?: boolean;
}


/**
 * Manages column filtering functionality for a data grid.
 * Provides utilities for evaluating filter conditions and toggling the visibility of filters.
 */
export class ColumnFilteringFeature<TOriginalRow> {
    // Stores all filter conditions for the columns
    conditions: FilterCondition<TOriginalRow>[] = $state([]);
    manual: boolean = $state(false);

    constructor(config?: ColumnFilteringFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: ColumnFilteringFeatureConfig) {
        this.conditions = config?.conditions ?? this.conditions;
        this.manual = config?.manual ?? this.manual;
    }


    /**
     * Retrieves the filter condition value for a given column.
     * @param columnId - The ID of the column.
     * @returns The filter condition value or `null` if no condition exists.
     */
    getConditionValue(columnId: string): any {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition ? condition.value : null;
    }

    /**
     * Retrieves the filter operator for a given column.
     * @param columnId - The ID of the column.
     * @returns The filter operator or `undefined` if no condition exists.
     */
    getConditionOperator(columnId: string): FilterOperator | undefined {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition?.operator;
    }

    /**
     * Updates the filter operator for a given column.
     * @param columnId - The ID of the column.
     * @param operator - The new filter operator to set.
     */
    changeConditionOperator(columnId: string, operator: FilterOperator) {
        const condition = this.conditions.find(c => c.columnId === columnId);
        if (!condition) return; // Exit if no condition exists for the column
        condition.operator = operator;
    }

    /**
     * Evaluates a cell value against a filter condition.
     * @param cellValue - The value of the cell to evaluate.
     * @param condition - The filter condition to evaluate against.
     * @returns `true` if the cell value satisfies the condition, otherwise `false`.
     */
    evaluateCondition(cellValue: any, condition: FilterCondition<TOriginalRow>): boolean {
        const { value, valueTo, operator } = condition;

        // Handle null/undefined cell values
        if (cellValue === null || cellValue === undefined) {
            return operator === 'empty';
        }

        // Convert to string for string operations
        const stringCellValue = String(cellValue).toLowerCase();
        const stringValue = String(value).toLowerCase();

        switch (operator) {
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
                // Default behavior: always return true
                return true;
        }
    }
}
