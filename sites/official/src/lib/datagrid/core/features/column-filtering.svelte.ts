import { isGroupColumn } from "../helpers/column-guards";
import type { DataGrid } from "../index.svelte";
import type { FilterCondition, FilterOperator } from "../types";
import { findColumnById, flattenColumnStructure, flattenColumnStructureAndClearGroups } from "../utils.svelte";


export type ColumnFilteringFeatureConfig = {
    conditions?: FilterCondition<any>[];
    manual?: boolean;
    onColumnFilteringChange?(filteredColumns: string[]): void;
}


/**
 * Manages column filtering functionality for a data grid.
 * Provides utilities for evaluating filter conditions and toggling the visibility of filters.
 */
export class ColumnFilteringFeature<TOriginalRow = any> {
    datagrid: DataGrid

    // Stores all filter conditions for the columns
    conditions: FilterCondition<TOriginalRow>[] = $state([]);
    manual: boolean = $state(false);

    onColumnFilteringChange: (filteredColumns: string[]) => void = () => { };

    constructor(datagrid: DataGrid, config?: ColumnFilteringFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }


    initialize( config?: ColumnFilteringFeatureConfig) {
        this.conditions = config?.conditions ?? this.conditions;
        this.manual = config?.manual ?? this.manual;
        this.onColumnFilteringChange = config?.onColumnFilteringChange ?? this.onColumnFilteringChange;
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
        let condition = this.conditions.find(c => c.columnId === columnId);
        if (!condition) {
            // If no condition exists, create a new one

            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), columnId);
            if (!column) throw new Error(`Column ${columnId} not found`);
            if (isGroupColumn(column)) throw new Error(`Cannot filter group column: ${columnId}`);
            if (column.type === 'display') throw new Error(`Cannot filter display column: ${columnId}`);

            this.conditions.push({
                columnId,
                operator,
                value: null,
                valueTo: undefined,
                getValueFn: column.getValueFn 
            });
        }
        condition = this.conditions.find(c => c.columnId === columnId);
        if (!condition) throw new Error(`Condition for column ${columnId} not found`);
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
