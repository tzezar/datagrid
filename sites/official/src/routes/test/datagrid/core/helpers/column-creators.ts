
// More specific types for different kinds of values
import type { AccessorFn, CellValue, Cell, ColumnId, GetGroupValue, GetValueFn, HeaderCell } from "../types";
import { DEFAULT_COLUMN_SIZE } from "./constants";

// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;

// Specific interfaces for different column types
export interface AccessorColumn<TOriginalRow> {
  type: 'accessor';
  header: string;
  columnId: string;
  parentColumnId: string | null;
  accessorKey: DotNestedKeys<TOriginalRow>;
  getValueFn: GetValueFn<TOriginalRow>;
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: Cell<TOriginalRow>
  headerCell?: HeaderCell<TOriginalRow>
  options: {
    searchable: boolean,
    groupable: boolean,
    sortable: boolean,
    filterable: boolean,
    pinnable: boolean,
    moveable: boolean
  },
  state: {
    size: {
      width: number,
      minWidth: number,
      maxWidth: number,
      grow: boolean
    }
    visible: boolean
    pinning: {
      position: 'left' | 'right' | 'none'
      offset: number
    }
  }
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
  cell?: Cell<TOriginalRow>
  headerCell?: HeaderCell<TOriginalRow>

  options: {
    searchable: boolean
    groupable: boolean,
    sortable: boolean
    filterable: boolean
    pinnable: boolean,
    moveable: boolean
  },
  state: {
    size: {
      width: number,
      minWidth: number,
      maxWidth: number,
      grow: boolean
    }
    visible: boolean
    pinning: {
      position: 'left' | 'right' | 'none'
      offset: number
    }
  }
  _meta: any;
}

export interface DisplayColumn<TOriginalRow> {
  type: 'display';
  header: string;
  columnId: string;
  parentColumnId: string | null;
  cell: Cell<TOriginalRow>,
  headerCell?: HeaderCell<TOriginalRow>

  options: {
    searchable: null,
    groupable: null,
    sortable: null
    filterable: null
    pinnable: boolean
    moveable: boolean

  },
  state: {
    size: {
      width: number,
      minWidth: number,
      maxWidth: number,
      grow: boolean
    },
    visible: boolean,
    pinning: {
      position: 'left' | 'right' | 'none'
      offset: number
    }

  }
  _meta: any;
}

export interface GroupColumn<TOriginalRow> {
  type: 'group';
  header: string;
  headerCell?: HeaderCell<TOriginalRow>
  columnId: string;
  parentColumnId: string | null;
  columns: AnyColumn<TOriginalRow>[];
  cell?: Cell<TOriginalRow>,
  options: {
    searchable: null
    groupable: null,
    sortable: null
    filterable: null
    pinnable: null
    moveable: boolean
  },
  state: {
    size: {
      width: number,
      minWidth: number,
      maxWidth: number,
      grow: boolean
    }
    visible: null
    pinning: {
      position: null,
      offset: number
    }
  }
  _meta: any,
}

// Union type for all column types
export type AnyColumn<TOriginalRow> =
  | AccessorColumn<TOriginalRow>
  | ComputedColumn<TOriginalRow>
  | DisplayColumn<TOriginalRow>
  | GroupColumn<TOriginalRow>;


type CreateAccessorColumnProps<TOriginalRow, TKey extends DotNestedKeys<TOriginalRow>> = {
  header: string,
  columnId: ColumnId,
  parentColumnId: string | null,
  accessorKey: TKey,
  getValueFn: (row: TOriginalRow) => CellValue,
  getGroupValueFn?: GetGroupValue<TOriginalRow>;
  cell?: Cell<TOriginalRow>
  headerCell?: HeaderCell<TOriginalRow>
  options?: {
    searchable?: boolean
    groupable?: boolean,
    sortable?: boolean
    filterable?: boolean
    pinnable?: boolean
    moveable?: boolean
  }
  _meta?: any
}

type CreateComputeColumnProps<TOriginalRow> = {
  header: string,
  columnId: ColumnId,
  parentColumnId: string | null,

  accessorFn: (row: TOriginalRow) => CellValue,
  getValueFn: (row: TOriginalRow) => CellValue,
  getGroupValueFn?: GetGroupValue<TOriginalRow>;

  cell?: Cell<TOriginalRow>
  headerCell?: HeaderCell<TOriginalRow>

  options?: {
    searchable?: boolean
    groupable?: boolean
    sortable?: boolean
    filterable?: boolean
    pinnable?: boolean
    moveable?: boolean
  },
  _meta?: any
}

type CreateDisplayColumnProps<TOriginalRow> = {
  header: string,
  columnId: ColumnId,
  parentColumnId: string | null,
  cell: Cell<TOriginalRow>
  headerCell?: HeaderCell<TOriginalRow>
  options?: {
    searchable?: false
    groupable?: boolean,
    sortable?: false
    filterable?: false
    pinnable?: boolean
    moveable?: boolean
  },
  _meta?: any
}

type CreateGroupColumnProps<TOriginalRow> = {
  header: string,
  headerCell?: HeaderCell<TOriginalRow>
  columnId: ColumnId,
  parentColumnId: string | null,
  columns: AnyColumn<TOriginalRow>[],
  _meta?: any,


}

// Helper functions with improved type inference
export function createAccessorColumn<
  TOriginalRow extends Record<string, any>,
  TKey extends DotNestedKeys<TOriginalRow>
>(
  { header, accessorKey, columnId,  getValueFn: getValue, options, _meta = {}, state, ...rest }: CreateAccessorColumnProps<TOriginalRow, TKey>,
): AccessorColumn<TOriginalRow> {
  return {
    type: 'accessor',
    columnId,
    header,
    accessorKey,
    getValueFn: getValue,
    options: {
      searchable: options?.searchable ?? true,
      groupable: options?.groupable ?? true,
      sortable: options?.sortable ?? true,
      filterable: options?.filterable ?? true,
      pinnable: options?.pinnable ?? true,
      moveable: options?.moveable ?? true,
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      },
    },
    _meta,
    ...rest
  };
}


export function createComputedColumn<TOriginalRow extends Record<string, any>>(
  { header, columnId, accessorFn, getValueFn: getValue, _meta = {}, options, state, ...rest }: CreateComputeColumnProps<TOriginalRow>,
): ComputedColumn<TOriginalRow> {
  return {
    type: 'computed',
    header,
    columnId,
    accessorFn,
    getValueFn: getValue,
    options: {
      searchable: options?.searchable ?? true,
      groupable: options?.groupable ?? true,
      sortable: options?.sortable ?? true,
      filterable: options?.filterable ?? true,
      pinnable: options?.pinnable ?? true,
      moveable: options?.moveable ?? true,
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      },
    },
    _meta,
    ...rest
  };
}

export function createDisplayColumn<TOriginalRow extends Record<string, any>>(
  { header, cell, columnId, _meta, options, state }: CreateDisplayColumnProps<TOriginalRow>,
): DisplayColumn<TOriginalRow> {
  return {
    type: 'display',
    header,
    columnId,
    cell,
    options: {
      searchable: null,
      groupable: null,
      sortable: null,
      filterable: null,
      pinnable: options?.pinnable ?? true,
      moveable: options?.moveable ?? true,
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      }
    },
    _meta
  };
}


export function createColumnGroup<TOriginalRow extends Record<string, any>>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow>,
): GroupColumn<TOriginalRow> {
  return {
    type: 'group',
    columnId,
    header,
    _meta,
    columns,
    options: {
      searchable: null,
      groupable: null,
      sortable: null,
      filterable: null,
      pinnable: null,
      moveable: true,
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: null,
      pinning: {
        position: null,
        offset: 0
      }
    },
    ...rest
  };
}