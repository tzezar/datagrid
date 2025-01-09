import type { GetValueFn, FormatterFn, AggregationConfig, GetGroupValue, CustomCell, HeaderCell, AccessorFn, ColumnId, CellValue } from "../types";

// Helper type to get nested key paths
export type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;
// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (T extends object ? {
  [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
// Specific interfaces for different column types

export interface AccessorColumn<TOriginalRow> {
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
    showDropdownOptions?: boolean;
  };
  state: {
    size: {
      width: number;
      minWidth: number;
      maxWidth: number;
      grow: boolean;
    };
    visible: boolean;
    pinning: {
      position: 'left' | 'right' | 'none';
      offset: number;
    };
  };
  _meta: any;
}

export interface ComputedColumn<TOriginalRow> {
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
    showDropdownOptions?: boolean;
  };
  state: {
    size: {
      width: number;
      minWidth: number;
      maxWidth: number;
      grow: boolean;
    };
    visible: boolean;
    pinning: {
      position: 'left' | 'right' | 'none';
      offset: number;
    };
  };
  _meta: any;
}

export interface DisplayColumn<TOriginalRow> {
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
    showDropdownOptions?: boolean;

  };
  state: {
    size: {
      width: number;
      minWidth: number;
      maxWidth: number;
      grow: boolean;
    };
    visible: boolean;
    pinning: {
      position: 'left' | 'right' | 'none';
      offset: number;
    };

  };
  _meta: any;
}

export interface GroupColumn<TOriginalRow> {
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
    showDropdownOptions: null;
  };
  state: {
    size: {
      width: number;
      minWidth: number;
      maxWidth: number;
      grow: boolean;
    };
    visible: null;
    pinning: {
      position: null;
      offset: number;
    };
  };
  _meta: any;
}
// Union type for all column types

export type AnyColumn<TOriginalRow> = AccessorColumn<TOriginalRow> |
  ComputedColumn<TOriginalRow> |
  DisplayColumn<TOriginalRow> |
  GroupColumn<TOriginalRow>;


export type ParentColumnId = string | null;
export type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow>> = {
  header: string;
  columnId: ColumnId;
  parentColumnId?: ParentColumnId;
  accessorKey: TKey;
  getValueFn: (row: TOriginalRow) => CellValue;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  aggregate?: AggregationConfig;
  cell?: CustomCell<TOriginalRow>;
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
    showDropdownOptions?: boolean;
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
  _meta?: any;
};
export type CreateComputeColumnProps<TOriginalRow> = {
  header: string;
  columnId: ColumnId;
  parentColumnId?: ParentColumnId;

  accessorFn: (row: TOriginalRow) => CellValue;
  getValueFn: (row: TOriginalRow) => CellValue;
  aggregate?: AggregationConfig;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  formatter?: FormatterFn<TOriginalRow>;
  cell?: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  options?: {
    searchable?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    pinnable?: boolean;
    moveable?: boolean;
    showDropdownOptions?: boolean;
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
  _meta?: any;
};
export type CreateDisplayColumnProps<TOriginalRow> = {
  header: string;
  columnId: ColumnId;
  parentColumnId?: ParentColumnId;
  cell: CustomCell<TOriginalRow>;
  headerCell?: HeaderCell;
  options?: {
    searchable?: false;
    groupable?: boolean;
    sortable?: false;
    filterable?: false;
    pinnable?: boolean;
    moveable?: boolean;
    showDropdownOptions?: boolean;
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
  _meta?: any;
};
export type CreateGroupColumnProps<TOriginalRow> = {
  header: string;
  headerCell?: HeaderCell;
  columnId: ColumnId;
  parentColumnId?: ParentColumnId;
  columns: AnyColumn<TOriginalRow>[];
  _meta?: any;
};


  