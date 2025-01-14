import type { AccessorColumn, AnyColumn, GroupColumn } from "./column-creation/types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, SortableColumn } from "./types";
import type { DataGrid } from "./index.svelte";


export function generateRandomColumnId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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

export function getNestedValue<T>(obj: T, path: string): any {
    return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
  }
  

export function createHeader({ header, accessorKey, columnId }: { header?: string, accessorKey?: string, columnId?: string }): string {
    if (header) {
        // If a header is explicitly defined, return it
        return header;
    } else if (columnId) {
        // If no header is defined, use the accessorKey (formatted for better readability)
        return columnId;
    } else if (accessorKey) {
        // If no header is defined, use the accessorKey (formatted for better readability)
        return formatAccessorKey(accessorKey);
    }
    throw new Error(`Either header or accessorKey or columnId must be defined`);
    // Fallback to the columnId if neither header nor accessorKey are available
}

/**
 * Formats an accessor key into a more human-readable string.
 * For example, "profile.email" becomes "Profile Email".
 */
function formatAccessorKey(accessorKey: string): string {
    return accessorKey
        .split('.') // Split nested keys by `.`
        .map(key => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize each part
        .join(' '); // Join with a space
}

/**
 * Generates a column ID if not explicitly provided.
 * Fallback logic: Use `accessorKey`, then `header`, or throw an error if neither is available.
 */
export function createColumnId({
    columnId,
    accessorKey,
    header,
}: {
    columnId?: string;
    accessorKey?: string;
    header?: string;
}): string {
    if (columnId) return columnId;
    if (accessorKey) return accessorKey; // Use accessorKey as the fallback column ID
    if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
    throw new Error("A valid columnId, accessorKey, or header must be provided to create a column.");
}