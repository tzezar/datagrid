import type { FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, ColumnId, CellValue, ColumnSizeState, ColumnPinningState, AnyColumn, ParentColumnId, AggregatedCell, GroupedCell, ColumnAlign } from "../types";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;


// Column creation props
export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow>> = {
  accessorKey: TKey;
  header?: string;
  getValueFn?: (row: TOriginalRow) => CellValue;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
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
  align?: ColumnAlign
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps;



export type CreateComputeColumnProps<TOriginalRow> = {
  // accessorFn: (row: TOriginalRow) => CellValue;
  getValueFn: (row: TOriginalRow) => CellValue;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
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
  align?: ColumnAlign
  header: string;
  state?: ColumnCreationStateProps
} & CommonColumnCreationProps;

export type CreateDisplayColumnProps<TOriginalRow> = {
  cell: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  aggregatedCell?: AggregatedCell<TOriginalRow>;
  groupedCell?: GroupedCell<TOriginalRow>;
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
  align?: ColumnAlign
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
  pinning?: Partial<ColumnPinningState>;
}

type CommonColumnCreationProps = {
  _meta?: any;
  parentColumnId?: ParentColumnId
  columnId?: ColumnId;
}