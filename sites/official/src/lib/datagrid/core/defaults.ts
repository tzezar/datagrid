import type { FilterOperator } from "./types";

export const DATAGRID_DEFAULTS = {
    PAGE_SIZE: 10,
    PAGE_SIZES: [10, 20, 50, 100],
} as const


export const DEFAULT_COLUMN_SIZE = {
    width: 200,
    minWidth: 60,
    maxWidth: 700,
    grow: false
}

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
];

export const stringFilterOperators: FilterOperator[] = [
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