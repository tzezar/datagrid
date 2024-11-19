type Primitive = string | number | boolean | null | undefined;

// More specific types for different kinds of values
type CellValue = Primitive | Record<string, any> | Array<any>;

// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;

interface ColumnBase<TData> {
  id?: string;
  header: string;
  sortable?: boolean;
  hidden?: boolean;
}

// Specific interfaces for different column types
interface AccessorColumn<TData> extends ColumnBase<TData> {
  accessorKey: DotNestedKeys<TData>;
  accessorFn?: never;
  cell?: (info: {
    getValue: () => any;
    row: { original: TData }
  }) => string | number | boolean | null | undefined;
}

interface ComputedColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn: (row: TData) => CellValue;
  cell?: (info: {
    getValue: () => any;
    row: { original: TData }
  }) => string | number | boolean | null | undefined;
}

interface DisplayColumn<TData> extends ColumnBase<TData> {
  accessorKey?: never;
  accessorFn?: never;
  cell: (info: {
    getValue: () => undefined;
    row: { original: TData }
  }) => string;
}

interface GroupColumn<TData> extends ColumnBase<TData> {
  columns: ColumnDef<TData>[];
}

// Union type for all column types
export type ColumnDef<TData> =
  | AccessorColumn<TData>
  | ComputedColumn<TData>
  | DisplayColumn<TData>
  | GroupColumn<TData>;


type CreateColumnProps<TData, TKey extends DotNestedKeys<TData>> = {
  header: string,
  accessorKey: TKey,
  options?: Omit<Partial<AccessorColumn<TData>>, 'header' | 'accessorKey'>
}

// Helper functions with improved type inference
export function createColumn<
  TData extends Record<string, any>,
  TKey extends DotNestedKeys<TData>
>(
  { header, accessorKey, options = {} }: CreateColumnProps<TData, TKey>,
): AccessorColumn<TData> {
  return {
    header,
    accessorKey,
    ...options,
  };
}

type CreateAccessorColumnProps<TData> = {
  header: string,
  accessorFn: (row: TData) => CellValue,
  options?: Omit<Partial<ComputedColumn<TData>>, 'header' | 'accessorFn'>
}

export function createAccessorColumn<TData extends Record<string, any>>(
  { header, accessorFn, options = {} }: CreateAccessorColumnProps<TData>,
): ComputedColumn<TData> {
  return {
    header,
    accessorFn,
    ...options,
  };
}

type CreateDisplayColumnProps<TData> = {
  header: string,
  cell: (info: { getValue: () => undefined; row: { original: TData } }) => string,
  options?: Omit<Partial<DisplayColumn<TData>>, 'header' | 'cell'>
}

export function createDisplayColumn<TData extends Record<string, any>>(
  { header, cell, options = {} }: CreateDisplayColumnProps<TData>,
): DisplayColumn<TData> {
  return {
    header,
    cell,
    ...options,
  };
}

type CreateGroupColumnProps<TData> = {
  header: string,
  columns: ColumnDef<TData>[],
  options?: Omit<Partial<GroupColumn<TData>>, 'header' | 'columns'>
}

export function createColumnGroup<TData extends Record<string, any>>(
  { header, columns, options = {} }: CreateGroupColumnProps<TData>,
): GroupColumn<TData> {
  return {
    header,
    columns,
    ...options,
  };
}