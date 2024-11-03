import type { DatagridInstance } from "../index.svelte";

export type FilterOperator = 
    | 'equals' 
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'between'
    | 'inList'
    | 'notInList'
    | 'empty'
    | 'notEmpty';

export interface FilterCondition {
    accessor: string;
    operator: FilterOperator;
    value: any;
    valueTo?: any; // For 'between' operator
}

export interface FilteringState {
    conditions: FilterCondition[];
}

export interface FilteringFeature {
    state: FilteringState;
    addFilter(condition: FilterCondition): void;
    removeFilter(accessor: string): void;
    clearFilters(): void;
    isRowMatching(row: any): boolean;
}

export class FilteringManager implements FilteringFeature {
    protected grid: DatagridInstance;
    state: FilteringState

    constructor(grid: DatagridInstance) {
        this.grid = grid;
        this.state = {
            conditions: []
        };
    }

    addFilter(condition: FilterCondition): void {
        // Remove any existing filter for the same column
        this.removeFilter(condition.accessor);
        this.state.conditions.push(condition);
        this.grid.rows = this.grid.dataProcessor.process();

        console.log(this.state.conditions)
    }

    removeFilter(accessor: string): void {
        this.state.conditions = this.state.conditions.filter(
            condition => condition.accessor !== accessor
        );
        
        this.grid.rows = this.grid.dataProcessor.process();
    }

    clearFilters(): void {
        this.state.conditions = [];
        this.grid.rows = this.grid.dataProcessor.process();
    }

    isRowMatching(row: any): boolean {
        return this.state.conditions.every(condition => 
            this.evaluateCondition(row[condition.accessor], condition)
        );
    }

    private evaluateCondition(cellValue: any, condition: FilterCondition): boolean {
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