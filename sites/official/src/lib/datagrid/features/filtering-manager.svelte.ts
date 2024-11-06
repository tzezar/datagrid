import Fuse from "fuse.js";
import type { DatagridInstance, FilteringStateConfig } from "../index.svelte";
import type { Accessor, ColumnId } from "../processors/column-processor.svelte";

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
    columnId: ColumnId;
    accessor: Accessor;
    operator: FilterOperator;
    value: any;
    valueTo?: any; // For 'between' operator
}

export type FilteringState = {
    fuse: Fuse<any> | null;
    conditions: FilterCondition[];
    search: SearchState;
}

export type FilteringFeature = {
    initialize(state: FilteringStateConfig): void

    addFilter(condition: FilterCondition): void;
    removeFilter(accessorKey: string): void;
    clearFilters(): void;
    isRowMatching(row: any): boolean;

    initializeFuseInstance(items: any[], keys: string[]): Fuse<any>;
    assignFuseInstance(items: any[]): void;

    getConditionOperator(accessorKey: string): FilterOperator;
    getConditionValue(accessorKey: string): any;
    getConditionValueTo(accessorKey: string): any;
} & FilteringState

export interface SearchState {
    value: string;
    fuzzy: boolean;
    delay: number;
}

export class FilteringManager implements FilteringFeature {
    protected grid: DatagridInstance;
    fuse: Fuse<any> | null = null
    conditions: FilterCondition[] = $state([])

    search: SearchState = {
        value: '',
        fuzzy: true,
        delay: 500
    }

    constructor(grid: DatagridInstance) {
        this.grid = grid;
    }

    initialize(state: FilteringStateConfig): void {
        this.fuse = state?.fuse || this.initializeFuseInstance(this.grid.original.data, this.grid.columns.map(col => col.columnId))
        this.conditions = state?.conditions || this.conditions
        this.search = state?.search || this.search
    }

    getConditionOperator(accessorKey: string): FilterOperator {
        const operator = this.conditions.find(condition => condition.columnId === accessorKey)?.operator
        if (!operator) return 'equals'
        return operator
    }
    getConditionValue(accessorKey: string): any {
        const condition = this.conditions.find(condition => condition.columnId === accessorKey)
        if (!condition) return null
        return condition.value
    }
    getConditionValueTo(accessorKey: string): any {
        const condition = this.conditions.find(condition => condition.columnId === accessorKey)
        if (!condition) return null
        return condition.valueTo
    }



    addFilter(condition: FilterCondition): void {
        // Remove any existing filter for the same column
        this.removeFilter(condition.columnId);
        this.conditions.push(condition);
    }

    removeFilter(accessorKey: string): void {
        this.conditions = this.conditions.filter(
            condition => condition.columnId !== accessorKey
        );
    }

    clearFilters(): void {
        this.conditions = [];
        this.grid.dataProcessor.process();
    }

    isRowMatching(row: any): boolean {
        return this.conditions.every(condition =>
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

    assignFuseInstance(items: any[]): void {
        this.fuse = this.initializeFuseInstance(items, this.grid.columnManager.getSearchableColumns().map(col => col.columnId as string))
    }
}