import { isGroupColumn } from "./column-guards";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "./column-creation/types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, GridBasicRow, GridGroupRow, GridRow, SortableColumn } from "./types";
import type { Datagrid } from "./index.svelte";


export function getCellContent(column: AnyColumn<any>, row: any): CellValue | HTMLElement {
    if (column.type === 'accessor') {
        column = column as AccessorColumn<any>;
        if (column.formatter) {
            return column.formatter(row);
        }
        return column.getValueFn(row);
    } else if (column.type === 'computed') {
        column = column as ComputedColumn<any>;
        if (column.formatter) {
            return column.formatter(row);
        }
        return column.getValueFn(row);
    } else if (column.type === 'display') {
        column = column as DisplayColumn<any>;
        return column.cell(row);
    } else if (column.type === 'group') {
        throw new Error('Group columns are not supported');
    }
}

export function generateRandomColumnId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function flattenColumns(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (const column of columns) {
        if (isGroupColumn(column)) {
            flattened.push(column);
            flattened.push(...flattenColumns(column.columns));
        } else {
            flattened.push(column);
        }
    }

    return flattened;
}

// Find column by ID in nested structure
export function findColumnById<TOriginalRow>(columns: AnyColumn<TOriginalRow>[], id: ColumnId): AnyColumn<TOriginalRow> | null {
    const flatColumns = flattenColumns(columns);
    return flatColumns.find((col) => col.columnId === id || col.header === id) ?? null;
}
export function isDescendantOf(possibleDescendant: GroupColumn<any>, ancestor: GroupColumn<any>): boolean {
    if (!possibleDescendant) return false;

    // Check direct children
    if (ancestor.columns.includes(possibleDescendant)) return true;

    // Recursively check children of group columns
    return ancestor.columns
        .filter((col): col is GroupColumn<any> => col.type === 'group')
        .some(childGroup => isDescendantOf(possibleDescendant, childGroup));
}



// Get sort index for display
export const getSortIndex = (datagrid: Datagrid<any>, column: AnyColumn<any>): number | null => {
    column = column as SortableColumn<any>;
    if (!column.options.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.sorting.sortConfigs.find((config) => config.columnId === columnId);
    return sortConfig ? sortConfig.index + 1 : null;
};


export const getSortDirection = (datagrid: Datagrid<any>, column: AnyColumn<any>): 'desc' | 'asc' | 'intermediate' | null => {
    column = column as SortableColumn<any>;
    if (!column.options.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.sorting.sortConfigs.find((config) => config.columnId === columnId);
    if (!sortConfig) return 'intermediate';
    return sortConfig.desc ? 'desc' : 'asc';
};


export const isGridGroupRow = <TOriginalRow,>(
    row: GridRow<TOriginalRow>
): row is GridGroupRow<TOriginalRow> => {
    return (row as GridGroupRow<TOriginalRow>).children !== undefined;
};





export const isColumnFilterable = <TOriginalRow>(
    column: AnyColumn<TOriginalRow>
): (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>) | null => {
    if (column.options.filterable !== null) {
        return column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
    }
    return null;
};

export const isColumnSortable = <TOriginalRow>(
    column: AnyColumn<TOriginalRow>
): SortableColumn<TOriginalRow> | null => {
    if (column.options.sortable !== null) {
        return column as SortableColumn<TOriginalRow>;
    }
    return null;
};


// Helper to check if a row is a group row
export function isGroupRow<TOriginalRow>(row: GridRow<TOriginalRow>): row is GridGroupRow<TOriginalRow> {
    return 'children' in row;
}

export function isBasicRow<TOriginalRow>(row: GridRow<TOriginalRow>): row is GridBasicRow<TOriginalRow> {
    return 'original' in row;
}

export function isCellComponent(value: any): value is CustomCellComponentWithProps {
    return value && typeof value === 'object' && 'component' in value
}