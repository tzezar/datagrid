import type { AggregationFn } from "./features/grouping-manager.svelte";
import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet } from "./processors/column-processor.svelte";


export type AccessorKey<TData> = TData| (string & {});
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
        width: number;
        minWidth: number;
        maxWidth: number;
    },
    formatter?: (row: any) => any;
    faceting?: NumericFacet | CategoricalFacet;
    allowedSortDirections: SortDirection[]
    header: string;
    _meta: any
}


export type ColumnDef<TData> = {
    accessorKey: AccessorKey<TData>;
    accessorFn?: AccessorFn<TData>;
    footer?: string;
    pinning?: "left"| "right"
    cell?: {
        component?: any;
        style?: (row: TData) => any;
    }
    aggregationFn?: AggregationFn
} & Partial<Omit<CommonColumnProps, 'header'>> & {
    header: string
}
