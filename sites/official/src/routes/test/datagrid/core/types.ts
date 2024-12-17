export type ColumnId = string;
type Primitive = string | number | boolean | null | undefined;
export type GetValueFn<TData> = (row: TData) => CellValue;
export type CellValue = Primitive | Record<string, any> | Array<any>;

export type GridGroupRow<TOriginalRow> = {
    index: string;
    groupId: string;
    groupKey: string;
    groupValue: any[];
    depth: number;
    children: GridRow<TOriginalRow>[];
};
export type GridBasicRow<TOriginalRow> = {
    index: string;
    original: TOriginalRow;
};

export type GridRow<TOriginalRow> = GridGroupRow<TOriginalRow> | GridBasicRow<TOriginalRow>;



export interface SortConfig {
    id: string;
    desc: boolean;
    index: number;
}


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

export interface FilterCondition<TOriginalRow> {
    columnId: ColumnId;
    getValueFn: GetValueFn<TOriginalRow> 
    operator: FilterOperator;
    value: any;
    valueTo?: number; // For 'between' operator
}

export interface SearchState {
    value: string;
    fuzzy: boolean;
    delay: number;
}

export type FilteringState<TOriginalRow> = {
    conditions: FilterCondition<TOriginalRow>[];
}