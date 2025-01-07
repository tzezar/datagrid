import type { Component } from "svelte";
import type { AccessorColumn, ComputedColumn } from "./helpers/column-creators";


export type ColumnType = 'accessor' | 'computed' | 'display' | 'group';

export type ColumnId = string;
type Primitive = string | number | boolean | null | undefined;
export type GetValueFn<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type GetGroupValue<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type CellValue = Primitive | Record<string, any> | Array<any>;


export type GridRowIdentifier = GridGroupRowIdentifier | GridBasicRowIdentifier

export type GridGroupRowIdentifier = string
export type GridBasicRowIdentifier = string | number



export type RowPinningPosition = 'top' | 'bottom' | false;


export type Cell = (props: any) => {
    component: Component<any>,
    props: object
} | string | HTMLElement



export type HeaderCell<TOriginalRow> = (row: TOriginalRow) =>
    | string
    | HTMLElement
    | {
        component: Component,
        props: { row: TOriginalRow }
    }



export type AccessorFn<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type FormatterFn<TOriginalRow> = (row: TOriginalRow) => CellValue;

export type Aggregation = {
    type: string;
    value: number;
    columnId: ColumnId;
};

export type AggregationFn = (values: any[]) => any;
export type BaseAggregationConfig = 
    | 'sum' 
    | 'min' 
    | 'max' 
    | 'extent' 
    | 'mean' 
    | 'median' 
    | 'unique' 
    | 'uniqueCount' 
    | 'count' 
    | { type: string; fn?: AggregationFn };

export type AggregationConfig = BaseAggregationConfig | BaseAggregationConfig[];



export type GridGroupRow<TOriginalRow> = {
    index: string;
    identifier: GridGroupRowIdentifier; // GroupId
    groupKey: string;
    groupValue: any[];
    depth: number;
    children: GridRow<TOriginalRow>[];
    aggregations: Aggregation[];
};
export type GridBasicRow<TOriginalRow> = {
    identifier: GridRowIdentifier;
    index: string;
    parentIndex: string | null;
    original: TOriginalRow;
};

export type GridRow<TOriginalRow> = GridGroupRow<TOriginalRow> | GridBasicRow<TOriginalRow>;

export type SortableColumn<TOriginalRow> = AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;

export type FilterableColumn<TOriginalRow> = AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;


export interface SortConfig {
    id: string;
    desc: boolean;
    index: number;
}

export type PinningPosition = 'left' | 'right' | 'none'

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


