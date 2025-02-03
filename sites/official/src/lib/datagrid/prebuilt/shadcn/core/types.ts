import type { AnyColumn, GridRow } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "./index.svelte";

export type ShadcnColumnMeta<TOriginalRow = any> = {
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
        bodyCell?: ((props: { datagrid: TzezarsDatagrid, column: AnyColumn<TOriginalRow>, row: GridRow<TOriginalRow> }) => string);
        headerCell?: ((props: { datagrid: TzezarsDatagrid, column: AnyColumn<TOriginalRow> }) => string);
    }
}




