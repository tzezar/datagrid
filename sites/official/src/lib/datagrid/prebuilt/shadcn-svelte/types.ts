import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { FullscreenFeature } from "./core/features/fullscreen.svelte";
import type { GroupHeadersVisibilityFeature } from "./core/features/group-headers-visibility.svelte";

export type ColumnMeta = {
    align?: 'start' | 'center' | 'end';
    // filterType?: 'text' | 'number' | 'select' | 'date' | 'dateRange' | 'range';
    filterType?: 'text' | 'number' | 'select'
    filterOptions?: { label: string, value: string }[];
    showColumnManagerDropdownMenu?: boolean;
    // TODO add more types and apply them in components
    styles?: {
        bodyCell?: string;
        headerCell?: string;
    }
}


export type TzezarsDatagrid<TOriginalRow = any> = DataGrid<TOriginalRow> & {
    fullscreen: FullscreenFeature
    groupHeadersVisibility: GroupHeadersVisibilityFeature
    
    showColumnGroups: boolean
    toggleColumnGroups(): void
    
    extra: {
        highlightSelectedRow: boolean
    }
}