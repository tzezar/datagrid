import type { AnyColumn, GridRow } from "$lib/datagrid/core/types";
import type { EnhancedDatagrid } from "./index.svelte";

export type ColumnMetaEnhanced<TOriginalRow = any> = {
    align?: 'start' | 'center' | 'end';
    grow?: boolean;
    // filterType?: 'text' | 'number' | 'select' | 'date' | 'dateRange' | 'range';
    filterType?: 'text' | 'number' | 'select' | 'date'
    filterOptions?: { label: string, value: string }[];
    showColumnManagerDropdownMenu?: boolean;
    clickToCopy?: boolean;
    tooltip?: boolean;

    // TODO add more types and apply them in components
    styles?: {
        bodyCell?: ((props: { datagrid: EnhancedDatagrid, column: AnyColumn<TOriginalRow>, row: GridRow<TOriginalRow> }) => string);
        headerCell?: ((props: { datagrid: EnhancedDatagrid, column: AnyColumn<TOriginalRow> }) => string);
    }
}




