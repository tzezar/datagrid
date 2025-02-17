import type { ColumnDef, ColumnId, GroupColumn } from "./types";
import type { CellValue, CustomCellComponentWithProps, } from "./types";

/**
 * Generates a random column ID.
 *
 * @returns A random string that can be used as a column ID.
 */
export function generateRandomColumnId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Gets the content of a cell based on the column definition and original row data.
 *
 * @param column The column definition.
 * @param originalRow The original row data.
 * @returns The content of the cell.
 */
export function getCellContent(column: ColumnDef<any>, originalRow: any): CellValue | HTMLElement {
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

/**
 * Checks if a column is a descendant of another column in a nested structure.
 *
 * @param possibleDescendant The column to check.
 * @param ancestor The ancestor column.
 * @returns True if the column is a descendant, false otherwise.
 */
export function isColumnInGroupTree(possibleDescendant: GroupColumn<any>, ancestor: GroupColumn<any>): boolean {
    if (!possibleDescendant) return false;

    // Check if the possible descendant is a direct child of the ancestor
    if (ancestor.columns.includes(possibleDescendant)) return true;

    // Recursively check if the possible descendant is a descendant of any group columns
    return ancestor.columns
        .filter((col): col is GroupColumn<any> => col.type === 'group') // Type guard to ensure we only check GroupColumn types
        .some(childGroup => isColumnInGroupTree(possibleDescendant, childGroup)); // Recursive call for group columns
}

/**
 * Checks if a value is a custom cell component.
 *
 * @param value The value to check.
 * @returns True if the value is a custom cell component, false otherwise.
 */
export function isCellComponent(value: any): value is CustomCellComponentWithProps {
    return value && typeof value === 'object' && 'component' in value
}

/**
 * Debounces a function by a specified delay.
 *
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced function.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    }) as T;
}

/**
 * Flattens a column structure, optionally preserving groups.
 *
 * @param columns The column structure to flatten.
 * @param preserveGroups Whether to preserve groups.
 * @returns The flattened column structure.
 */
export function flattenColumnStructure(
    columns: ColumnDef<any>[],
    preserveGroups: boolean = false
): ColumnDef<any>[] {
    const flattened: ColumnDef<any>[] = [];

    /**
     * Recursively processes columns and adds them to the flattened array.
     *
     * @param columns The columns to process.
     * @param result The flattened array.
     */
    const processColumns = (columns: ColumnDef<any>[], result: ColumnDef<any>[]) => {
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.type === 'group') {
                processColumns(column.columns, result);
                result.push(preserveGroups ? column : { ...column, columns: [] });
            } else {
                result.push(column);
            }
        }
    };

    processColumns(columns, flattened);
    return flattened;
}

/**
 * Flattens a column structure and clears groups.
 *
 * @param columns The column structure to flatten.
 * @returns The flattened column structure.
 */
export function flattenColumnStructureAndClearGroups(columns: ColumnDef<any>[]): ColumnDef<any>[] {
    return flattenColumnStructure(columns, false);
}

/**
 * Flattens a nested column structure while preserving group headers.
 * @param columns - The array of column definitions, potentially containing nested structures.
 * @returns A flattened array of column definitions with groups retained.
 */
export function flattenColumnStructurePreservingGroups(columns: ColumnDef<any>[]): ColumnDef<any>[] {
    return flattenColumnStructure(columns, true);
}

/**
 * Finds a column by its unique ID in a flat list of column definitions.
 * @param flatColumns - The array of column definitions, assumed to be already flattened.
 * @param id - The unique identifier of the column to find.
 * @returns The column definition if found, otherwise null.
 */
export function findColumnById<TOriginalRow>(flatColumns: ColumnDef<TOriginalRow>[], id: ColumnId): ColumnDef<TOriginalRow> | null {
    return flatColumns.find((col) => col.columnId === id) ?? null;
}

/**
 * Converts a selected options event from a <select> element into an array of values.
 * @param event - The event triggered by selecting options in a <select> element.
 * @returns An array of selected option values.
 */
export function convertSelectedOptionsToArray(event: any) {
    return Array.from(event.currentTarget.selectedOptions).map(
        (option: any) => option.value
    );
}
