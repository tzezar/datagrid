type Primitive = string | number | boolean | null | undefined;
export type ColumnId = string;

// More specific types for different kinds of values
export type CellValue = Primitive | Record<string, any> | Array<any>;

// Helper type to get nested key paths
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : "") extends infer D ? Extract<D, string> : never;


export type AccessorFn<TData> = (row: TData) => CellValue
export type ColumnHeader = string
export type ColumnCell<TData> = (row?: TData) => string | HTMLElement



// Specific interfaces for different column types
export interface AccessorColumn<TData> {
  columnId: string,
  type: 'accessor',
  accessorKey: DotNestedKeys<TData>,
  header: ColumnHeader
  accessorFn: AccessorFn<TData>
  cell?: ColumnCell<TData>,
  options: {
    sortable: boolean,
    resizable: boolean,
    movable: boolean,
    pinnable: boolean,
    hideable: boolean,
    filterable: boolean,
    groupable: boolean,
    searchable: boolean,
  }
  state: {
    visible: boolean,
  }
}

export interface ComputedColumn<TData> {
  type: 'computed',
  accessorFn: AccessorFn<TData>;
  header: ColumnHeader
  cell?: ColumnCell<TData>,
  options: {
    sortable: boolean,
    resizable: boolean,
    movable: boolean,
    pinnable: boolean,
    hideable: boolean,
    filterable: boolean,
    groupable: boolean,
    searchable: boolean,
  }
  state: {
    visible: boolean,
  }
}

export interface DisplayColumn<TData> {
  type: 'display',
  header: ColumnHeader
  cell?: ColumnCell<TData>,
  options: {
    sortable: boolean,
    resizable: boolean,
    movable: boolean,
    pinnable: boolean,
    hideable: boolean,
    filterable: boolean,
    groupable: boolean,
    searchable: boolean,
  }
  state: {
    visible: boolean,
  }
}

export interface GroupColumn<TData> {
  type: 'group',
  header: ColumnHeader
  columns: ColumnDef<TData>[]
  options: {
    sortable: boolean,
    resizable: boolean,
    movable: boolean,
    pinnable: boolean,
    hideable: boolean,
    filterable: boolean,
    groupable: boolean,
    searchable: boolean,
  }
}

// Union type for all column types
export type ColumnDef<TData> =
  | AccessorColumn<TData>
  | ComputedColumn<TData>
  | DisplayColumn<TData>
  | GroupColumn<TData>;


// TODO
export type SearchableColumn<TData> = AccessorColumn<TData>

// Accessor column
type CreateAccessorColumnProps<TData, TKey extends DotNestedKeys<TData>> = {
  header: string,
  accessorKey: TKey,
  accessorFn: AccessorFn<TData>,
}

export function createAccessorColumn<
  TData extends Record<string, any>,
  TKey extends DotNestedKeys<TData>
>(
  { header, accessorKey, accessorFn }: CreateAccessorColumnProps<TData, TKey>,
): AccessorColumn<TData> {
  return {
    columnId: accessorKey,
    type: 'accessor',
    header,
    accessorKey,
    accessorFn,
    options: {
      sortable: true,
      resizable: true,
      movable: true,
      pinnable: true,
      hideable: true,
      filterable: true,
      groupable: true,
      searchable: true,
    },
    state: {
      visible: true,
    },
  };
}

// Computed column
type CreateComputeColumnProps<TData> = {
  header: string,
  accessorFn: (row: TData) => CellValue,
  // options?: Omit<Partial<ComputedColumn<TData>>, 'header' | 'accessorFn'>
  options?: {
    sortable?: boolean,
    resizable?: boolean,
    movable?: boolean,
    pinnable?: boolean,
    hideable?: boolean,
    filterable?: boolean,
    groupable?: boolean,
    searchable?: boolean,
  }
}

export function createComputedColum<TData extends Record<string, any>>(
  { header, accessorFn }: CreateComputeColumnProps<TData>,
): ComputedColumn<TData> {
  return {
    type: 'computed',
    header,
    accessorFn,
    options: {
      sortable: true,
      resizable: true,
      movable: true,
      pinnable: true,
      hideable: true,
      filterable: true,
      groupable: true,
      searchable: true,
    },
    state: {
      visible: true,
    },
  };
}

// Display column
type CreateDisplayColumnProps<TData> = {
  header: string,
  accessorFn: (row: TData) => CellValue,
  options?: {
    sortable?: boolean,
    resizable?: boolean,
    movable?: boolean,
    pinnable?: boolean,
    hideable?: boolean,
    filterable?: boolean,
    groupable?: boolean,
    searchable?: boolean,
  }
}

export function createDisplayColumn<TData extends Record<string, any>>(
  { header }: CreateDisplayColumnProps<TData>,
): DisplayColumn<TData> {
  return {
    type: 'display',
    header,
    options: {
      sortable: true,
      resizable: true,
      movable: true,
      pinnable: true,
      hideable: true,
      filterable: true,
      groupable: true,
      searchable: true,
    },
    state: {
      visible: true,
    },
  };
}

// Group column
type CreateGroupColumnProps<TData> = {
  header: string,
  columns: ColumnDef<TData>[],
  // options?: Omit<Partial<GroupColumn<TData>>, 'header' | 'columns'>
}

export function createColumnGroup<TData extends Record<string, any>>(
  { header, columns }: CreateGroupColumnProps<TData>,
): GroupColumn<TData> {
  return {
    type: 'group',
    header,
    columns,
    options: {
      sortable: false,
      resizable: false,
      movable: false,
      pinnable: false,
      hideable: false,
      filterable: false,
      groupable: false,
      searchable: false,
    },
  };
}
