import type { Component } from "svelte";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn } from "./column-creation/types";
import type { Datagrid } from "./index.svelte";


export type ColumnType = 'accessor' | 'computed' | 'display' | 'group';

export type ColumnId = string;
type Primitive = string | number | boolean | null | undefined;
export type GetValueFn<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type GetGroupValue<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type CellValue = Primitive | Record<string, any> | Array<any>;


export type ColumnSizeState = {
    width: number;
    minWidth: number;
    maxWidth: number;
    // grow: boolean;
}
export type ColumnPinningState = {
    position: 'left' | 'right' | 'none';
    offset: number;
}




export type GridRowIdentifier = GridGroupRowIdentifier | GridBasicRowIdentifier

export type GridGroupRowIdentifier = string
export type GridBasicRowIdentifier = string | number

export type LeafColumn<TOriginalRow> = AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow> | DisplayColumn<TOriginalRow>

export type RowPinningPosition = 'top' | 'bottom' | false;


export type CustomCellComponentWithProps = {
    component: Component<any>;
    props?: object;
};

export type CustomCellProps<TOriginalRow> = {
    datagrid: Datagrid<any>;
    column: AnyColumn<any>;
    row: GridBasicRow<TOriginalRow>
}

export type CustomCell<TOriginalRow> = (props: CustomCellProps<TOriginalRow>) => string | HTMLElement | CustomCellComponentWithProps

export type CustomHeaderCellProps = {
    column: AnyColumn<any>;
    datagrid: Datagrid<any>;
}


export type HeaderCell = (props: CustomHeaderCellProps) => string | HTMLElement | CustomCellComponentWithProps



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
    columnId: string;
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


