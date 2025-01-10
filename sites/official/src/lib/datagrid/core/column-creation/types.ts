import type { GetValueFn, FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, AccessorFn, ColumnId, CellValue, ColumnSizeState, ColumnPinningState } from "../types";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
// Specific interfaces for different column types

export interface AccessorColumn<TOriginalRow, TMeta = any> {
  type: 'accessor';
  header: string;
  columnId: string;
  parentColumnId: string | null;
  accessorKey: DotNestedKeys<TOriginalRow>;
  getValueFn: GetValueFn<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
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
}

export interface ComputedColumn<TOriginalRow, TMeta = any> {
  type: 'computed';
  header: string;
  columnId: string;
  parentColumnId: string | null;
  accessorFn: AccessorFn<TOriginalRow>;
  getValueFn: GetValueFn<TOriginalRow>;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
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
}

export interface DisplayColumn<TOriginalRow, TMeta = any> {
  type: 'display';
  header: string;
  columnId: string;
  parentColumnId: string | null;
  cell: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;

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
}

export interface GroupColumn<TOriginalRow, TMeta = any> {
  type: 'group';
  header: string;
  headerCell?: HeaderCell;
  columnId: string;
  parentColumnId: string | null;
  columns: AnyColumn<TOriginalRow>[];
  cell?: CustomCell<TOriginalRow>;
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
}
// Union type for all column types


type CommonColumnProps = {
  header: string;
  headerCell?: HeaderCell;
  columnId: ColumnId;
  parentColumnId?: ParentColumnId;
  _meta?: any;
}

export type AnyColumn<TOriginalRow> = AccessorColumn<TOriginalRow> |
  ComputedColumn<TOriginalRow> |
  DisplayColumn<TOriginalRow> |
  GroupColumn<TOriginalRow>;


export type ParentColumnId = string | null;

export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow>> = {
  accessorKey: TKey;
  getValueFn: (row: TOriginalRow) => CellValue;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  cell?: CustomCell<TOriginalRow>;
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
  state?: {
    size?: {
      width?: number;
      minWidth?: number;
      maxWidth?: number;
      grow?: boolean;
    };
    visible?: boolean;
    pinning?: {
      position?: 'left' | 'right' | 'none';
      offset?: number;
    };
  };
} & CommonColumnProps;



export type CreateComputeColumnProps<TOriginalRow> = {
  accessorFn: (row: TOriginalRow) => CellValue;
  getValueFn: (row: TOriginalRow) => CellValue;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  options?: {
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  state?: {
    size?: {
      width?: number;
      minWidth?: number;
      maxWidth?: number;
      grow?: boolean;
    };
    visible?: boolean;
    pinning?: {
      position?: 'left' | 'right' | 'none';
      offset?: number;
    };
  };
} & CommonColumnProps;

export type CreateDisplayColumnProps<TOriginalRow> = {
  cell: CustomCell<TOriginalRow>;
  options?: {
    searchable?: false;
    groupable?: boolean;
    sortable?: false;
    filterable?: false;
    pinnable?: boolean;
    moveable?: boolean;
    hideable?: boolean;
  };
  state?: {
    size?: {
      width: number;
      minWidth: number;
      maxWidth: number;
      grow: boolean;
    };
    visible?: boolean;
    pinning?: {
      position?: 'left' | 'right' | 'none';
      offset?: number;
    };
  };
} & CommonColumnProps;
export type CreateGroupColumnProps<TOriginalRow> = {
  columns: AnyColumn<TOriginalRow>[];
} & CommonColumnProps;


