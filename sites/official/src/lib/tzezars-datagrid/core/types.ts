import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet } from "../core/processors/column-processor.svelte";
import type { Row } from "./processors/data-processor.svelte";
import type { AggregationFn } from "./features/grouping-manager.svelte";
import type { Datagrid, DatagridConfig } from "./index.svelte";


type PathImpl<T, K extends keyof T> = 
  K extends string
    ? T[K] extends Record<string, any>
      ? T[K] extends Array<any>
        ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
        : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
    : never;

// Modified to only return the full paths, not intermediate objects
export type NestedPaths<T> = {
  [K in PathImpl<T, keyof T>]: K extends keyof T 
    ? T[K] extends Record<string, any>
      ? never 
      : K
    : K
}[PathImpl<T, keyof T>];

// Modified AccessorKey to use NestedPaths
export type AccessorKey<TData, TCustomKeys extends string = never> = NestedPaths<TData> | TCustomKeys;
export type Accessor<TData> = (row: TData) => any
export type AccessorFn<TData> = (row: TData) => any

export type CommonColumnProps = {
    sortable: boolean;
    resizable: boolean;
    movable: boolean;
    pinnable: boolean;
    hideable: boolean;
    filterable: boolean;
    groupable: boolean;
    searchable?: boolean;
    visible: boolean;
    size: {
        grow: boolean;
        width: number;
        minWidth: number;
        maxWidth: number;
    },
    formatter?: (row: any) => any;
    faceting?: NumericFacet | CategoricalFacet;
    allowedSortDirections: SortDirection[]
    header: string;
    align?: "start" | "center" | "end";
    _meta: any
}


export type ColumnDef<TData, TCustomKeys extends string = never> = {
    accessorKey?: AccessorKey<TData, TCustomKeys>;
    accessorFn?: AccessorFn<TData>;
    footer?: string;
    pinning?: "left" | "right";
    cell?: {
        component?: any;
        style?: (row: Row<TData>) => any;
    };
    aggregationFn?: AggregationFn;
} & Partial<Omit<CommonColumnProps, 'header'>> & {
    header: string;
};

// Plugins

export interface DatagridPlugin<TData> {
  name: string;
  initialize?: (datagrid: Datagrid<TData, any>) => void;
  destroy?: () => void;
  // Allow any additional properties
  [key: string]: any;
}

export interface DatagridFeature<TData extends string = never> extends DatagridPlugin<TData> {
  state: Record<string, any>;
}

// Type for plugin configurations
export type PluginConfig = Record<string, any>;

export interface ExtendedDatagridConfig<TData, TCustomKeys extends string = never> extends DatagridConfig<TData, TCustomKeys> {
  plugins?: DatagridPlugin<TData>[];
  features?: Record<string, PluginConfig>;
}
