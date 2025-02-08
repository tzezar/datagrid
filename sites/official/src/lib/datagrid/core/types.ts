import type { Component } from "svelte";
import type { DatagridCore } from "./index.svelte";
import type { LifecycleHooks } from "./managers/lifecycle-hooks-manager.svelte";
import type { SortingFeature } from "./features";
import type { PaginationFeature, PaginationFeatureConfig } from "./features/pagination.svelte";
import type { ColumnFilteringFeature, ColumnFilteringFeatureConfig } from "./features/column-filtering.svelte";
import type { ColumnFacetingFeature, ColumnFacetingFeatureConfig } from "./features/column-faceting.svelte";
import type { GlobalSearchFeature, GlobalSearchFeatureConfig } from "./features/global-search.svelte";
import type { GroupingFeature, GroupingFeatureConfig } from "./features/grouping.svelte";
import type { RowExpansionFeature, RowExpansionConfig } from "./features/row-expanding.svelte";
import type { RowSelectionFeature, RowSelectionFeatureConfig } from "./features/row-selection.svelte";
import type { RowPinningFeature, RowPinningFeatureConfig } from "./features/row-pinning.svelte";
import type { ColumnMovementDirection, ColumnOrderingFeature, ColumnOrderingFeatureConfig } from "./features/column-ordering.svelte";
import type { ColumnGroupingFeature, ColumnGroupingPluginConfig } from "./features/column-grouping.svelte";
import type { ColumnPinningFeature, ColumnPinningFeatureConfig } from "./features/column-pinning.svelte";
import type { ColumnSizingFeature, ColumnSizingFeatureConfig } from "./features/column-sizing.svelte";
import type { ColumnVisibilityFeature, ColumnVisibilityPluginConfig } from "./features/column-visibility.svelte";
import type { SortingFeatureConfig } from "./features/sorting.svelte";

// Specific interfaces for different column types


/**
 * Column and Identifier Types
 */
// export type ColumnId<T = any> = keyof T | (string & {})
export type ColumnId = string
export type ExtractColumnIds<T> = T extends AccessorColumn<any, any>[]
    ? T[number]["columnId"]
    : never;
export type ColumnType = "accessor" | "computed" | "display" | "group";

/**
 * Primitive and Cell Value Types
 */
export type Primitive = string | number | boolean | null | undefined;
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

export type ColumnPinningPosition = "left" | "right" | "none";

export type ColumnPinningState = {
    position: ColumnPinningPosition
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


// Cell
export type CustomCellProps<TOriginalRow> = {
    datagrid: DatagridCore<any>;
    column: LeafColumn<any>;
    row: GridBasicRow<TOriginalRow>;
};

export type CustomCell<TOriginalRow> = (
    props: CustomCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;

// Aggregated Cell
export type AggregateCellProps<TOriginalRow> = {
    datagrid: DatagridCore<any>;
    column: LeafColumn<any>;
    row: GridGroupRow<TOriginalRow>;
};
export type AggregatedCell<TOriginalRow> = (
    props: AggregateCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;

// Grouped Cell
export type GroupedCellProps<TOriginalRow> = {
    datagrid: DatagridCore<any>;
    column: LeafColumn<any>;
    row: GridGroupRow<TOriginalRow>;
};

export type GroupedCell<TOriginalRow> = (
    props: GroupedCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;

// Header Cell
export type HeaderCellProps = {
    column: AnyColumn<any>;
    datagrid: DatagridCore<any>;
};

export type HeaderCell = (
    props: HeaderCellProps
) => string | HTMLElement | CustomCellComponentWithProps;

/**
 * Sorting Types
 */

export type SortingDirection = "ascending" | "descending" | "intermediate";
export interface Sorting {
    columnId: ColumnId;
    direction: SortingDirection
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



// Columns
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
    [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
// Specific interfaces for different column types

export type ColumnAlign = 'left' | 'center' | 'right';

export interface AccessorColumn<TOriginalRow, TMeta = any> {
    type: 'accessor';
    header: string;
    // columnId: DotNestedKeys<TOriginalRow>;
    columnId: ColumnId;
    parentColumnId: string | null;
    accessorKey: DotNestedKeys<TOriginalRow>;
    getValueFn: GetValueFn<TOriginalRow>;
    formatterFn?: FormatterFn<TOriginalRow>;
    aggregate?: AggregationConfig;
    getGroupValueFn?: GetGroupValue<TOriginalRow>;
    cell?: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell;
    options: {
        calculateFacets: boolean;
        searchable: boolean;
        groupable: boolean;
        sortable: boolean;
        filterable: boolean;
        pinnable: boolean;
        moveable: boolean;
        hideable: boolean;
    };
    state: {
        size: ColumnSizeState
        visible: boolean;
        pinning: ColumnPinningState
    };
    align: ColumnAlign
    _meta: TMeta
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface ComputedColumn<TOriginalRow, TMeta = any> {
    type: 'computed';
    header: string;
    columnId: ColumnId
    parentColumnId: ColumnId | null;
    // accessorFn: AccessorFn<TOriginalRow>;
    getValueFn: GetValueFn<TOriginalRow>;
    getGroupValueFn?: GetGroupValue<TOriginalRow>;
    cell?: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell;
    formatterFn?: FormatterFn<TOriginalRow>;
    aggregate?: AggregationConfig;
    options: {
        calculateFacets: boolean;
        searchable: boolean;
        groupable: boolean;
        sortable: boolean;
        filterable: boolean;
        pinnable: boolean;
        moveable: boolean;
        hideable: boolean;
    };
    state: {
        size: ColumnSizeState
        visible: boolean;
        pinning: ColumnPinningState
    };
    align: ColumnAlign
    _meta: TMeta;
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface DisplayColumn<TOriginalRow, TMeta = any> {
    type: 'display';
    header: string;
    columnId: ColumnId
    parentColumnId: string | null;
    cell: CustomCell<TOriginalRow>;
    aggregatedCell?: AggregatedCell<TOriginalRow>;
    groupedCell?: GroupedCell<TOriginalRow>;
    headerCell?: HeaderCell;
    options: {
        calculateFacets: null;
        searchable: null;
        groupable: null;
        sortable: null;
        filterable: null;
        pinnable: boolean;
        moveable: boolean;
        hideable: boolean;
    };
    state: {
        size: ColumnSizeState
        visible: boolean;
        pinning: ColumnPinningState

    };
    align: ColumnAlign
    _meta: TMeta;
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean
}

export interface GroupColumn<TOriginalRow, TMeta = any> {
    type: 'group';
    header: string;
    headerCell?: HeaderCell;
    columnId: ColumnId
    parentColumnId: string | null;
    columns: AnyColumn<TOriginalRow>[];
    options: {
        searchable: null;
        groupable: null;
        sortable: null;
        filterable: null;
        pinnable: null;
        moveable: boolean;
    };
    state: {
        size: ColumnSizeState
        visible: null;
        pinning: ColumnPinningState;
    };
    _meta: TMeta
    isVisible(): boolean;
    isSortable(): boolean;
    isFilterable(): boolean;
}
// Union type for all column types

export type AnyColumn<TOriginalRow, TMeta = any> =
    AccessorColumn<TOriginalRow, TMeta> |
    ComputedColumn<TOriginalRow, TMeta> |
    DisplayColumn<TOriginalRow, TMeta> |
    GroupColumn<TOriginalRow, TMeta>;


export type ParentColumnId = string | null;



export type FeatureConstructor<T> = {
    new(datagrid: DatagridCore<any>, config?: any): T;  // Class signature
};

export type InitialState = {
    sorting?: SortingFeatureConfig,
    pagination?: PaginationFeatureConfig,
    filtering?: ColumnFilteringFeatureConfig,
    faceting?: ColumnFacetingFeatureConfig,
    globalSearch?: GlobalSearchFeatureConfig,
    grouping?: GroupingFeatureConfig,
    rowExpanding?: RowExpansionConfig,
    rowSelection?: RowSelectionFeatureConfig,
    rowPinning?: RowPinningFeatureConfig,
    columnOrdering?: ColumnOrderingFeatureConfig,
    columnGrouping?: ColumnGroupingPluginConfig,
    columnPinning?: ColumnPinningFeatureConfig,
    columnSizing?: ColumnSizingFeatureConfig,
    columnVisibility?: ColumnVisibilityPluginConfig
}


export type DatagridCoreConfig<TOriginalRow, C extends AnyColumn<TOriginalRow> = AnyColumn<TOriginalRow>> = {
    columns: C[];
    data: TOriginalRow[];
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;  // Add this

    initialState?: InitialState

    config?: {
        measurePerformance?: boolean
        createBasicRowIdentifier?: (row: TOriginalRow) => string
        createBasicRowIndex?: (row: TOriginalRow) => string
    }

    features?: {
        sorting?: FeatureConstructor<SortingFeature>,
        pagination?: FeatureConstructor<PaginationFeature>,
        filtering?: FeatureConstructor<ColumnFilteringFeature>,
        faceting?: FeatureConstructor<ColumnFacetingFeature>,
        globalSearch?: FeatureConstructor<GlobalSearchFeature>,
        grouping?: FeatureConstructor<GroupingFeature>,
        rowExpanding?: FeatureConstructor<RowExpansionFeature>,
        rowSelection?: FeatureConstructor<RowSelectionFeature>,
        rowPinning?: FeatureConstructor<RowPinningFeature>,
        columnOrdering?: FeatureConstructor<ColumnOrderingFeature>,
        columnGrouping?: FeatureConstructor<ColumnGroupingFeature>,
        columnPinning?: FeatureConstructor<ColumnPinningFeature>,
        columnSizing?: FeatureConstructor<ColumnSizingFeature>,
        columnVisibility?: FeatureConstructor<ColumnVisibilityFeature>,
    }
}

export interface Command {
    execute(): void;
    undo?(): void;
}

export type CommandPayload = {
    type: string;
    payload: any;
}

export type GridEventCallback<T= any> = (data: T) => void;

export type OnPageChangePayload = { prevPage: number; newPage: number };

export type EventPayloadMap = {
    'onColumnSort': { column: LeafColumn<any>, multisort?: boolean };
    
    'onRowPin': { rowId: GridRowIdentifier };
    'onRowUnpin': { rowIdentifier: GridRowIdentifier };

    'onRowSelect': { rowIdentifier: GridRowIdentifier };
    'onRowDeselect': { rowIdentifier: GridRowIdentifier };
    'onRowSelectionLimitExceeded': { rowIdentifier: GridRowIdentifier };

    'onRowExpand': { rowIdentifier: GridRowIdentifier };
    'onRowCollapse': { rowIdentifier: GridRowIdentifier };
    'onRowExpansionLimitExceeded': { rowIdentifier: GridRowIdentifier };

    'onPageChange': OnPageChangePayload;
    'onPageSizeChange': { prevSize: number, pageSize: number };

    'onGroupExpand': { groupIdentifier: GridGroupRowIdentifier };
    'onGroupCollapse': { groupIdentifier: GridGroupRowIdentifier };
    'onGroupExpansionLimitExceeded': { maxExpandedGroups: number };

    'onGroupingChange': { activeGroups: ColumnId[] };

    'onSearchQueryChange': { prevQuery: string, newQuery: string };

    'onFilterChange': { column: LeafColumn<any> };
    'onColumnResize': { column: LeafColumn<any> };
    'onColumnVisibilityChange': { column: LeafColumn<any> };

    'onColumnGroupCreation': { columnGroup: GroupColumn<any> };
    'onColumnGroupDeletion': { columnGroup: GroupColumn<any> };
    'onColumnPinningChange': { column: LeafColumn<any> };
    'onColumnReorder': { columnId: ColumnId, direction: ColumnMovementDirection };

};


