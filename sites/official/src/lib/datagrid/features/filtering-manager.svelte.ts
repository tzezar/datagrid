import Fuse from "fuse.js";
import type { DatagridInstance } from "../index.svelte";
import type { Accessor } from "../processors/column-processor.svelte";

export const filterOperators: FilterOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between',
    'inList',
    'notInList',
    'empty',
    'notEmpty'
];

export const numberFilterOperators: FilterOperator[] = [
    'equals',
    'notEquals',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between',
    'empty',
    'notEmpty'
]

export const stringFilterOperators: FilterOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'empty',
    'notEmpty'
]

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
    accessorKey: string;
    accessor: Accessor;
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
    removeFilter(accessorKey: string): void;
    clearFilters(): void;
    isRowMatching(row: any): boolean;

    initializeFuseInstance(items: any[], keys: string[]): Fuse<any>;

    search: SearchState
}

export interface SearchState {
    value: string;
    fuzzy: boolean;
    delay: number;
}

export class FilteringManager implements FilteringFeature {
    protected grid: DatagridInstance;
    state: FilteringState = $state({
        conditions: []
    })

    search: SearchState = {
        value: '',
        fuzzy: true,
        delay: 500
    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
        this.state = {
            conditions: []
        };
    }

    addFilter(condition: FilterCondition): void {
        // Remove any existing filter for the same column
        this.removeFilter(condition.accessorKey);
        this.state.conditions.push(condition);
    }

    removeFilter(accessorKey: string): void {
        this.state.conditions = this.state.conditions.filter(
            condition => condition.accessorKey !== accessorKey
        );
    }

    clearFilters(): void {
        this.state.conditions = [];
        this.grid.rows = this.grid.dataProcessor.process();
    }

    isRowMatching(row: any): boolean {
        return this.state.conditions.every(condition =>
            // * There is room for improvemt here
            // adding cache for value to improve performance
            this.evaluateCondition(condition.accessor(row), condition)
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

    initializeFuseInstance<T>(items: T[], keys: string[]): Fuse<T> {
        return new Fuse(items, {
            keys,
            threshold: 0.3,
            location: 0,
            distance: 100,
            includeScore: true,
            useExtendedSearch: true,
            ignoreLocation: true,
            findAllMatches: true,
        });
    }
}