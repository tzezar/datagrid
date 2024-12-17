
// More specific types for different kinds of values

import type { CellValue, GetValueFn } from "../types";

// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;




interface ColumnBase<TData> {
  type: 'accessor' | 'computed' | 'display' | 'group';
  columnId: string;
  header: string;

  sortable?: boolean;
  hidden?: boolean;

  cell?: (row?: TData) => string | HTMLElement
  columns?: ColumnDef<TData>[];
  getValueFn?: GetValueFn<TData>;
  options: {
    searchable?: boolean
  },
  _meta: any;
}

// Specific interfaces for different column types
export interface AccessorColumn<TData> extends ColumnBase<TData> {
  accessorKey: DotNestedKeys<TData>;
  getValueFn: GetValueFn<TData>;
}

export interface ComputedColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn: (row: TData) => CellValue;
  getValueFn: GetValueFn<TData>;
}

export interface DisplayColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn?: never;
  getValueFn: never;
  cell: (row?: TData) => string | HTMLElement
}

export interface GroupColumn<TData> extends ColumnBase<TData> {
  columns: ColumnDef<TData>[];
}

// Union type for all column types
export type ColumnDef<TData> =
  | AccessorColumn<TData>
  | ComputedColumn<TData>
  | DisplayColumn<TData>
  | GroupColumn<TData>;


type CreateAccessorColumnProps<TData, TKey extends DotNestedKeys<TData>> = {
  header: string,
  columnId: string,
  accessorKey: TKey,
  getValue: (row: TData) => CellValue,
  options?: Omit<Partial<AccessorColumn<TData>>, 'header' | 'accessorKey'>
  _meta?: any
}

type CreateComputeColumnProps<TData> = {
  header: string,
  columnId: string,

  accessorFn: (row: TData) => CellValue,
  getValue: (row: TData) => CellValue,
  options?: Omit<Partial<ComputedColumn<TData>>, 'header' | 'accessorFn'>
  _meta?: any
}

type CreateDisplayColumnProps<TData> = {
  header: string,
  columnId: string,
  // cell: (info: { getValue: () => undefined; row: { original: TData } }) => string,
  cell: (row?: TData) => string | HTMLElement
  options?: Omit<Partial<DisplayColumn<TData>>, 'header' | 'cell'>
}

type CreateGroupColumnProps<TData> = {
  header: string,
  columns: ColumnDef<TData>[],
  options?: Omit<Partial<GroupColumn<TData>>, 'header' | 'columns'>
}

// Helper functions with improved type inference
export function createAccessorColumn<
  TData extends Record<string, any>,
  TKey extends DotNestedKeys<TData>
>(
  { header, accessorKey, columnId, getValue, options = {}, _meta = {}, ...rest }: CreateAccessorColumnProps<TData, TKey>,
): AccessorColumn<TData> {
  return {
    type: 'accessor',
    columnId,
    header,
    accessorKey,
    getValueFn: getValue,
    ...options,
    _meta,
    ...rest
  };
}


export function createComputedColum<TData extends Record<string, any>>(
  { header, columnId, accessorFn, getValue,_meta = {}, options = {}, ...rest }: CreateComputeColumnProps<TData>,
): ComputedColumn<TData> {
  return {
    type: 'computed',
    columnId,
    header,
    accessorFn,
    getValueFn: getValue,
    ...options,
    _meta,
    ...rest
  };
}

export function createDisplayColumn<TData extends Record<string, any>>(
  { header, cell, columnId, _meta, options = {} }: CreateDisplayColumnProps<TData>,
): DisplayColumn<TData> {
  return {
    type: 'display',
    columnId,
    header,
    cell,
    ...options,
    _meta
  };
}


export function createColumnGroup<TData extends Record<string, any>>(
  { header, columns, _meta, options = {} }: CreateGroupColumnProps<TData>,
): GroupColumn<TData> {
  return {
    type: 'group',
    header,
    columns,
    ...options,
    _meta
  };
}