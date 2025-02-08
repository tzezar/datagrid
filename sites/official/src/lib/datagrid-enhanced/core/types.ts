import type { AnyColumn, GridRow } from "$lib/datagrid/core/types";
import type { EnhancedDatagrid } from "./index.svelte";

export type ColumnMetaEnhanced<TOriginalRow = any> = {
    grow?: boolean;
    // TODO implement more types
    // filterType?: 'text' | 'number' | 'select' | 'date' | 'dateRange' | 'range';
    filterType?: 'text' | 'number' | 'select' | 'date'
    filterOptions?: { label: string, value: string }[];
    showColumnManagerDropdownMenu?: boolean;
    clickToCopy?: boolean;
    tooltip?: boolean;
    styles?: {
        bodyCell?: ((props: { datagrid: EnhancedDatagrid, column: AnyColumn<TOriginalRow>, row: GridRow<TOriginalRow> }) => string);
        headerCell?: ((props: { datagrid: EnhancedDatagrid, column: AnyColumn<TOriginalRow> }) => string);
    },
    // calculateFacets?: boolean
}

export type AutoColumnPosition = 'left' | 'right' | 'none'
