import type { FilterOperator } from "./features/filtering-manager.svelte";
import type { SortDirection } from "./features/sorting-manager.svelte";
import type { CategoricalFacet, NumericFacet } from "./processors/column-processor.svelte";

export interface ColumnDef {
    accessorKey: string;
    accessorFn?: (row: any) => any;
    formatter?: (row: any) => any;
    header: string;


    size?: {
        width: number;
        minWidth: number;
        maxWidth: number;
    },
    pinning?: {
        position: 'left' | 'right';
    }

    visible?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    // type: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'html' | 'image' | 'link' | 'custom' | 'unknown',
    type: 'string' | 'number',
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
}

export interface Data<T = any> {
    [key: string]: T;
}
