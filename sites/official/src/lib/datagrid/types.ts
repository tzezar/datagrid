import type { AggregationFn } from "./features/grouping-manager.svelte";
import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet } from "./processors/column-processor.svelte";

export type AccessorKey = string

export type DataType = 'string' | 'number' | 'date' | 'boolean'

export type CommonColumnProps = {
    sortable: boolean;
    resizable: boolean;
    movable: boolean;
    pinnable: boolean;
    hideable: boolean;
    // exportable: boolean;
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


export type ColumnDef = {
    accessorKey: AccessorKey;
    accessorFn?: (row: any) => any;
    footer?: string;
    pinning?: "left"| "right"
    cell?: {
        component?: any;
        style?: (row: any) => any;
    }
    aggregationFn?: AggregationFn
} & Partial<Omit<CommonColumnProps, 'header'>> & {
    header: string
}

export interface Data<T = any> {
    [key: string]: T;
}
