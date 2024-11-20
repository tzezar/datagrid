type Primitive = string | number | boolean | null | undefined;

// More specific types for different kinds of values
type CellValue = Primitive | Record<string, any> | Array<any>;

// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;

interface ColumnBase<TData> {
  type: 'accessor' | 'computed' | 'display' | 'group';
  id?: string;
  header: string;
  sortable?: boolean;
  hidden?: boolean;

  cell?: (row?: TData) => string | HTMLElement



  columns?: ColumnDef<TData>[];
  getValue?: (row: TData) => any;
}

// Specific interfaces for different column types
export interface AccessorColumn<TData> extends ColumnBase<TData> {
  accessorKey: DotNestedKeys<TData>;
  accessorFn?: never;
  getValue?: (row: TData) => CellValue
}

export interface ComputedColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn: (row: TData) => CellValue;
  getValue?: (row: TData) => CellValue
}

export interface DisplayColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn?: never;
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
  accessorKey: TKey,
  getValue: (row: TData) => CellValue,
  options?: Omit<Partial<AccessorColumn<TData>>, 'header' | 'accessorKey'>
}

type CreateComputeColumnProps<TData> = {
  header: string,
  accessorFn: (row: TData) => CellValue,
  getValue: (row: TData) => CellValue,
  options?: Omit<Partial<ComputedColumn<TData>>, 'header' | 'accessorFn'>
}

type CreateDisplayColumnProps<TData> = {
  header: string,
  // cell: (info: { getValue: () => undefined; row: { original: TData } }) => string,
  cell: (row: TData) => string,
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
  { header, accessorKey, getValue, options = {} }: CreateAccessorColumnProps<TData, TKey>,
): AccessorColumn<TData> {
  return {
    type: 'accessor',
    header,
    accessorKey,
    getValue,
    ...options,
  };
}


export function createComputedColum<TData extends Record<string, any>>(
  { header, accessorFn, getValue, options = {} }: CreateComputeColumnProps<TData>,
): ComputedColumn<TData> {
  return {
    type: 'computed',
    header,
    accessorFn,
    getValue,
    ...options,
  };
}

export function createDisplayColumn<TData extends Record<string, any>>(
  { header, cell, options = {} }: CreateDisplayColumnProps<TData>,
): DisplayColumn<TData> {
  return {
    type: 'display',
    header,
    cell,
    ...options,
  };
}


export function createColumnGroup<TData extends Record<string, any>>(
  { header, columns, options = {} }: CreateGroupColumnProps<TData>,
): GroupColumn<TData> {
  return {
    type: 'group',
    header,
    columns,
    ...options,
  };
}