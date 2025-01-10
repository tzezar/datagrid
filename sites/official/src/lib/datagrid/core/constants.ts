import type { ColumnType, FilterOperator } from "./types";
export const columnsWithGetters = ['accessor', 'computed'] satisfies ColumnType[];
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
];export const stringFilterOperators: FilterOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'startsWith',
    'endsWith',
    'empty',
    'notEmpty'
];

export const selectFilterOperators: FilterOperator[] = [
    'equals',
    'notEquals',
    'contains',
    'startsWith',
    'endsWith',
    'empty',
    'notEmpty'
];

