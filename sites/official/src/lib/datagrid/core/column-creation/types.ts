import type { GetValueFn, FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, ColumnId, CellValue, ColumnSizeState, ColumnPinningState } from "../types";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
// Specific interfaces for different column types

export interface AccessorColumn<TOriginalRow, TMeta = any> {
  type: 'accessor';
  header: string;
  // columnId: DotNestedKeys<TOriginalRow>;
  columnId: ColumnId;
  parentColumnId: string | null;
  accessorKey: DotNestedKeys<TOriginalRow>;
  getValueFn: GetValueFn<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  groupRowCell?: CustomCell<TOriginalRow>;
  options: {
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
  groupRowCell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  formatter?: FormatterFn<TOriginalRow>;
  aggregate?: AggregationConfig;

  options: {
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
  headerCell?: HeaderCell;
  groupRowCell?: CustomCell<TOriginalRow>;
  options: {
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
  _meta: TMeta;
  isVisible(): boolean;
  isSortable(): boolean;
  isFilterable(): boolean;
}
// Union type for all column types



export type AnyColumn<TOriginalRow> =
  AccessorColumn<TOriginalRow> |
  ComputedColumn<TOriginalRow> |
  DisplayColumn<TOriginalRow> |
  GroupColumn<TOriginalRow>;


export type ParentColumnId = string | null;

// Column creation props

export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow>> = {
  accessorKey: TKey;
  header?: string;
  getValueFn?: (row: TOriginalRow) => CellValue;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  cell?: CustomCell<TOriginalRow>;
  groupRowCell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  formatter?: FormatterFn<TOriginalRow>;
  options?: {
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps;



export type CreateComputeColumnProps<TOriginalRow> = {
  // accessorFn: (row: TOriginalRow) => CellValue;
  getValueFn: (row: TOriginalRow) => CellValue;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  groupRowCell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  options?: {
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  header: string;
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps;

export type CreateDisplayColumnProps<TOriginalRow> = {
  cell: CustomCell<TOriginalRow>;
  groupRowCell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  options?: {
    searchable?: false;
    groupable?: false;
    sortable?: false;
    filterable?: false;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  header: string;
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps;

export type CreateGroupColumnProps<TOriginalRow> = {
  header: string;
  headerCell?: HeaderCell;
  columns: AnyColumn<TOriginalRow>[];
} & CommonColumnCreationProps;


type ColumnCreationStateProps = {
  size?: ColumnSizeState;
  visible?: boolean;
  pinning?: ColumnPinningState;
}

type CommonColumnCreationProps = {
  _meta?: any;
  parentColumnId?: ParentColumnId;
  columnId?: ColumnId;
}