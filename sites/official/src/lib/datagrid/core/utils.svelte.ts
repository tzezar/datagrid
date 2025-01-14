import type { AnyColumn, GroupColumn } from "./column-creation/types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, SortableColumn } from "./types";
import type { DataGrid } from "./index.svelte";




export function getCellContent(column: AnyColumn<any>, originalRow: any): CellValue | HTMLElement {
    switch (column.type) {
        case 'accessor':
            if (column.formatter) {
                return column.formatter(originalRow);
            } else if (column.cell) {
                return column.cell(originalRow);
            } else {
                return column.getValueFn(originalRow);
            }
        case 'computed':
            if (column.formatter) {
                return column.formatter(originalRow);
            } else if (column.cell) {
                return column.cell(originalRow);
            } else {
                return column.getValueFn(originalRow);
            }
        case 'display':
            if (column.cell) {
                return column.cell(originalRow);
            } else {
                throw new Error('Display columns must have a cell function');
            }
        case 'group':
            throw new Error('Group columns are not supported');
    }
}


export function generateRandomColumnId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export function createFlatColumnStructure(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...createFlatColumnStructure(column.columns));
            flattened.push({ ...column, columns: [] });
        }
        else {
            flattened.push(column);
        }
    }
    return flattened;
}

export function createFlatColumnStructureAndPreserveChildren(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...createFlatColumnStructureAndPreserveChildren(column.columns));
            flattened.push(column);
        }
        else {
            flattened.push(column);
        }
    }
    return flattened;
}

// Find column by ID in nested structure
export function findColumnById<TOriginalRow>(flatColumns: AnyColumn<TOriginalRow>[], id: ColumnId): AnyColumn<TOriginalRow> | null {
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

export function isCellComponent(value: any): value is CustomCellComponentWithProps {
    return value && typeof value === 'object' && 'component' in value
}


