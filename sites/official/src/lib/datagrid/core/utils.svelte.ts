import { isGroupColumn } from "./helpers/column-guards";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "./column-creation/types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, GridBasicRow, GridGroupRow, GridRow, SortableColumn } from "./types";
import type { DataGrid } from "./index.svelte";


export function getCellContent(column: AnyColumn<any>, originalRow: any): CellValue | HTMLElement {
    if (column.type === 'accessor') {
        column = column as AccessorColumn<any>;
        if (column.formatter) {
            return column.formatter(originalRow);
        }
        return column.getValueFn(originalRow);
    } else if (column.type === 'computed') {
        column = column as ComputedColumn<any>;
        if (column.formatter) {
            return column.formatter(originalRow);
        }
        return column.getValueFn(originalRow);
    } else if (column.type === 'display') {
        column = column as DisplayColumn<any>;
        return column.cell(originalRow);
    } else if (column.type === 'group') {
        throw new Error('Group columns are not supported');
    }
}

export function getGroupRowCellContent(column: AnyColumn<any>, row: GridGroupRow<any>): CellValue | HTMLElement {
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

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...flattenColumns(column.columns));
            flattened.push({ ...column, columns: [] });
        }
        else {
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
export const getSortIndex = (datagrid: DataGrid<any>, column: AnyColumn<any>): number | null => {
    column = column as SortableColumn<any>;
    if (!column.options.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.features.sorting.sortConfigs.find((config) => config.columnId === columnId);
    return sortConfig ? sortConfig.index + 1 : null;
};


export const getSortDirection = (datagrid: DataGrid<any>, column: AnyColumn<any>): 'desc' | 'asc' | 'intermediate' | null => {
    column = column as SortableColumn<any>;
    if (!column.options.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.features.sorting.sortConfigs.find((config) => config.columnId === columnId);
    if (!sortConfig) return 'intermediate';
    return sortConfig.desc ? 'desc' : 'asc';
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

// Row utils
export const isGridGroupRow = <TOriginalRow,>(
    row: GridRow<TOriginalRow>
): row is GridGroupRow<TOriginalRow> => {
    return (row as GridGroupRow<TOriginalRow>).children !== undefined;
};


// Column utils
export function isColumnVisible(column: AnyColumn<any>): boolean {
    return column.state.visible === true;
}

export const isColumnSortable = <TOriginalRow>(
    column: AnyColumn<TOriginalRow>
): SortableColumn<TOriginalRow> | null => {
    if (column.options.sortable !== null || column.options.sortable !== false) {
        return column as SortableColumn<TOriginalRow>;
    }
    return null;
};

export const isColumnFilterable = <TOriginalRow>(
    column: AnyColumn<TOriginalRow>
): (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>) | null => {
    if (column.options.filterable !== null || column.options.filterable !== false) {
        return column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
    }
    return null;
};


function hasColumnGotVisibleChildren(column: any): boolean {
    if (!isGroupColumn(column)) return false;
    return column.columns.some((col: any) => {
        if (isGroupColumn(col)) {
            return hasColumnGotVisibleChildren(col);
        }
        return col.state.visible === true;
    });
}