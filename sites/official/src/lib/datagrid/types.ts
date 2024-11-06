import type { FilterOperator } from "./features/filtering-manager.svelte";
import type { AggregationFn } from "./features/grouping-manager.svelte";
import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet } from "./processors/column-processor.svelte";

export type AccessorKey = string

export type DataType = 'string' | 'number' | 'date' | 'boolean'

export interface ColumnDef {
    accessorKey: AccessorKey;
    accessorFn?: (row: any) => any;
    formatter?: (row: any) => any;
    header: string;
    footer?: string;
    size?: {
        width: number;
        minWidth: number;
        maxWidth: number;
    },
    pinning?: {
        position: 'left' | 'right';
    }

    visible?: boolean;

    sortable?: boolean;
    resizable?: boolean;
    movable?: boolean;
    pinnable?: boolean;
    hideable?: boolean;
    exportable?: boolean;
    filterable?: boolean;
    groupable?: boolean;
    
    type: DataType
    filter?: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'custom',
    allowedSortDirections?: SortDirection[]
    allowedFilterOperators?: FilterOperator[]
    cell?: {
        component?: any;
        style?: (row: any) => any;
    }
    faceting?: NumericFacet | CategoricalFacet;
    includeInSearch?: boolean;
    includeInExport?: boolean;
    aggregationFn?: AggregationFn
}

export interface Data<T = any> {
    [key: string]: T;
}
