import type { AnyColumn, GridRow } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "./index.svelte";

export type ShadcnColumnMeta<TOriginalRow = any> = {
    align?: 'start' | 'center' | 'end';
    // filterType?: 'text' | 'number' | 'select' | 'date' | 'dateRange' | 'range';
    filterType?: 'text' | 'number' | 'select'
    filterOptions?: { label: string, value: string }[];
    showColumnManagerDropdownMenu?: boolean;
    clickToCopy?: boolean;
    // TODO add more types and apply them in components
    styles?: {
        bodyCell?: ((props: { datagrid: TzezarsDatagrid, column: AnyColumn<any>, row: GridRow<TOriginalRow> }) => string);
        headerCell?: ((props: { datagrid: TzezarsDatagrid, column: AnyColumn<any> }) => string);
    }
}
