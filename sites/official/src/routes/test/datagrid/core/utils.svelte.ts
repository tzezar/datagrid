import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";
import { isGroupColumn } from "./column-guards";
import type { AccessorColumn, ColumnDef, ComputedColumn, DisplayColumn } from "./helpers/column-creators";
import type { CellValue, GridGroupRow, GridRow } from "./types";
import type { Datagrid } from "./index.svelte";

export function getCellContent(column: ColumnDef<any>, row: any): CellValue | HTMLElement {
    if (column.type === 'accessor') {
        column = column as AccessorColumn<any>;
        return column.getValueFn(row);
    } else if (column.type === 'computed') {
        column = column as ComputedColumn<any>;
        return column.getValueFn(row);
    } else if (column.type === 'display') {
        column = column as DisplayColumn<any>;
        return column.cell(row);
    } else if (column.type === 'group') {
        throw new Error('Group columns are not supported');
    }
}

export function flattenColumns(columns: ColumnDef<any>[]): ColumnDef<any>[] {
    const flattened: ColumnDef<any>[] = [];

    for (const column of columns) {
        if (isGroupColumn(column)) {
            flattened.push(...flattenColumns(column.columns));
        } else {
            flattened.push(column);
        }
    }

    return flattened;
}

// Find column by ID in nested structure
export function findColumnById(columns: ColumnDef<User>[], id: string): ColumnDef<User> | null {
    const flatColumns = flattenColumns(columns);
    return flatColumns.find((col) => col.columnId === id || col.header === id) ?? null;
}

// Handle sort click with multi-column support
export function onSort(datagrid: Datagrid<any>, column: ColumnDef<any>, event: MouseEvent) {
    const timeStart = performance.now();
    if (!column.sortable) return;

    const columnId = column.columnId || column.header;
    const existingIndex = datagrid.sorting.sortConfigs.findIndex(
        (config) => config.id === columnId
    );

    if (!event.shiftKey) {
        // Single column sort
        if (existingIndex === -1) {
            datagrid.sorting.sortConfigs = [{ id: columnId, desc: false, index: 0 }];
        } else if (!datagrid.sorting.sortConfigs[existingIndex].desc) {
            datagrid.sorting.sortConfigs = [{ id: columnId, desc: true, index: 0 }];
        } else {
            datagrid.sorting.sortConfigs = [];
        }
    } else {
        // Multi-column sort
        if (existingIndex === -1) {
            datagrid.sorting.sortConfigs = [
                ...datagrid.sorting.sortConfigs,
                { id: columnId, desc: false, index: datagrid.sorting.sortConfigs.length }
            ];
        } else if (!datagrid.sorting.sortConfigs[existingIndex].desc) {
            datagrid.sorting.sortConfigs = datagrid.sorting.sortConfigs.map((config, i) =>
                i === existingIndex ? { ...config, desc: true } : config
            );
        } else {
            datagrid.sorting.sortConfigs = datagrid.sorting.sortConfigs
                .filter((_, i) => i !== existingIndex)
                .map((config, i) => ({ ...config, index: i }));
        }
    }
    datagrid.executeFullDataTransformation();
    console.log('onSort', performance.now() - timeStart);
}

// Get sort index for display
export const getSortIndex = (datagrid: Datagrid<any>, column: ColumnDef<any>): number | null => {
    if (!column?.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.sorting.sortConfigs.find((config) => config.id === columnId);
    return sortConfig ? sortConfig.index + 1 : null;
};

// Get sort icon based on sort state
export const getSortIcon = (datagrid: any, column: ColumnDef<any>) => {
    if (!column?.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.sorting.sortConfigs.find((config) => config.id === columnId);
    if (!sortConfig) return ArrowUpDown;
    return sortConfig.desc ? ArrowDown : ArrowUp;
};

export const isGridGroupRow = <TOriginalRow,>(
    row: GridRow<TOriginalRow>
): row is GridGroupRow<TOriginalRow> => {
    return (row as GridGroupRow<TOriginalRow>).children !== undefined;
};


export const getSearchableColumns = (columns: ColumnDef<any>[]): ColumnDef<any>[] => {
    const searchableColumns = columns.filter(column => column.type === 'accessor' || column.type === 'computed')
        .filter((column) => column.options?.searchable !== false) as (AccessorColumn<any> | ComputedColumn<any>)[];
    return searchableColumns;
}