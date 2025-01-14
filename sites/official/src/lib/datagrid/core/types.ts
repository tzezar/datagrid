import type { Component } from "svelte";
import type {
    AccessorColumn,
    AnyColumn,
    ComputedColumn,
    DisplayColumn,
} from "./column-creation/types";
import type { DataGrid } from "./index.svelte";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
// Specific interfaces for different column types

// Specific interfaces for different column types


/**
 * Column and Identifier Types
 */
export type ColumnId<T = unknown> = keyof T | (string & {})
export type ExtractColumnIds<T> = T extends AccessorColumn<any, any>[]
    ? T[number]["columnId"]
    : never;
export type ColumnType = "accessor" | "computed" | "display" | "group";

/**
 * Primitive and Cell Value Types
 */
type Primitive = string | number | boolean | null | undefined;
export type CellValue = Primitive | Record<string, any> | Array<any>;
export type GetValueFn<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type GetGroupValue<TOriginalRow> = (row: TOriginalRow) => CellValue;
export type FormatterFn<TOriginalRow> = (row: TOriginalRow) => CellValue;

/**
 * Column State Types
 */
export type ColumnSizeState = {
    width: number;
    minWidth: number;
    maxWidth: number;
};
export type ColumnPinningState = {
    position: "left" | "right" | "none";
    offset: number;
};

/**
 * Row and Group Types
 */
export type GridRowIdentifier = GridGroupRowIdentifier | GridBasicRowIdentifier;
export type GridGroupRowIdentifier = string;
export type GridBasicRowIdentifier = string | number;
export type RowPinningPosition = "top" | "bottom" | false;

export type GridGroupRow<TOriginalRow> = {
    index: string;
    identifier: GridGroupRowIdentifier;
    groupKey: string;
    groupValue: any[];
    depth: number;
    children: GridRow<TOriginalRow>[];
    aggregations: Aggregation[];
    isExpanded: () => boolean;
    isGroupRow: () => this is GridGroupRow<TOriginalRow>;
};

export type GridBasicRow<TOriginalRow> = {
    identifier: GridRowIdentifier;
    index: string;
    parentIndex: string | null;
    original: TOriginalRow;
    isExpanded: () => boolean;
    isGroupRow: () => false
};

export type GridRow<TOriginalRow> =
    | GridGroupRow<TOriginalRow>
    | GridBasicRow<TOriginalRow>;

/**
 * Leaf Column Types
 */
export type LeafColumn<TOriginalRow, TMeta = any> =
    | AccessorColumn<TOriginalRow, TMeta>
    | ComputedColumn<TOriginalRow, TMeta>
    | DisplayColumn<TOriginalRow, TMeta>;

export type SortableColumn<TOriginalRow> =
    | AccessorColumn<TOriginalRow>
    | ComputedColumn<TOriginalRow>;

export type FilterableColumn<TOriginalRow> =
    | AccessorColumn<TOriginalRow>
    | ComputedColumn<TOriginalRow>;

/**
 * Aggregation Types
 */
export type Aggregation = {
    type: string;
    value: number;
    columnId: ColumnId;
};

export type AggregationFn = (values: any[]) => any;

export type BaseAggregationConfig =
    | "sum"
    | "min"
    | "max"
    | "extent"
    | "mean"
    | "median"
    | "unique"
    | "uniqueCount"
    | "count"
    | { type: string; fn?: AggregationFn };

export type AggregationConfig =
    | BaseAggregationConfig
    | BaseAggregationConfig[];

/**
 * Custom Cell and Header Types
 */
export type CustomCellComponentWithProps = {
    component: Component<any>;
    props?: object;
};

export type CustomCellProps<TOriginalRow> = {
    datagrid: DataGrid<any>;
    column: LeafColumn<any>;
    row: GridRow<TOriginalRow>;
};

export type CustomCell<TOriginalRow> = (
    props: CustomCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;


export type CustomGroupCellProps<TOriginalRow> = {
    datagrid: DataGrid<any>;
    column: LeafColumn<any>;
    row: GridGroupRow<TOriginalRow>;
};
export type CustomGroupCell<TOriginalRow> = (
    props: CustomGroupCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;


export type CustomHeaderCellProps = {
    column: AnyColumn<any>;
    datagrid: DataGrid<any>;
};

export type HeaderCell = (
    props: CustomHeaderCellProps
) => string | HTMLElement | CustomCellComponentWithProps;

/**
 * Sorting Types
 */
export interface SortConfig {
    columnId: string;
    desc: boolean;
    index: number;
}

/**
 * Pinning Types
 */
export type PinningPosition = "left" | "right" | "none";

/**
 * Filtering Types
 */
export type FilterOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "between"
    | "inList"
    | "notInList"
    | "empty"
    | "notEmpty";

export interface FilterCondition<TOriginalRow> {
    columnId: ColumnId;
    getValueFn: GetValueFn<TOriginalRow>;
    operator: FilterOperator;
    value: any;
    valueTo?: number; // For 'between' operator
}

export type FilteringState<TOriginalRow> = {
    conditions: FilterCondition<TOriginalRow>[];
};

/**
 * Search State
 */
export interface SearchState {
    value: string;
    fuzzy: boolean;
    delay: number;
}

/**
 * Filter Operators
 */
export const filterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
    "inList",
    "notInList",
    "empty",
    "notEmpty",
];

export const numberFilterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
    "empty",
    "notEmpty",
];

export const stringFilterOperators: FilterOperator[] = [
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "startsWith",
    "endsWith",
    "empty",
    "notEmpty",
];
