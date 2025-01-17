import type {  AnyColumn, GroupColumn } from "./types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, SortableColumn } from "./types";
import type { DataGrid } from "./index.svelte";


export function generateRandomColumnId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getCellContent(column: AnyColumn<any>, originalRow: any): CellValue | HTMLElement {
    switch (column.type) {
        case 'accessor':
            if (column.formatterFn) {
                return column.formatterFn(originalRow);
            } else if (column.cell) {
                return column.cell(originalRow);
            } else {
                return column.getValueFn(originalRow);
            }
        case 'computed':
            if (column.formatterFn) {
                return column.formatterFn(originalRow);
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



export function flattenColumnStructureAndClearGroups(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...flattenColumnStructureAndClearGroups(column.columns));
            flattened.push({ ...column, columns: [] });
        }
        else {
            flattened.push(column);
        }
    }
    return flattened;
}

export function flattenColumnStructurePreservingGroups(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...flattenColumnStructurePreservingGroups(column.columns));
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
    return flatColumns.find((col) => col.columnId === id) ?? null;
}

export function isInGroupTree(possibleDescendant: GroupColumn<any>, ancestor: GroupColumn<any>): boolean {
    if (!possibleDescendant) return false;

    // Check if the possible descendant is a direct child of the ancestor
    if (ancestor.columns.includes(possibleDescendant)) return true;

    // Recursively check if the possible descendant is a descendant of any group columns
    return ancestor.columns
        .filter((col): col is GroupColumn<any> => col.type === 'group') // Type guard to ensure we only check GroupColumn types
        .some(childGroup => isInGroupTree(possibleDescendant, childGroup)); // Recursive call for group columns
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


  

