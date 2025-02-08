import type { AnyColumn, GroupColumn } from "./types";
import type { CellValue, CustomCellComponentWithProps, } from "./types";

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

// Find column by ID in nested structure
export function isColumnInGroupTree(possibleDescendant: GroupColumn<any>, ancestor: GroupColumn<any>): boolean {
    if (!possibleDescendant) return false;

    // Check if the possible descendant is a direct child of the ancestor
    if (ancestor.columns.includes(possibleDescendant)) return true;

    // Recursively check if the possible descendant is a descendant of any group columns
    return ancestor.columns
        .filter((col): col is GroupColumn<any> => col.type === 'group') // Type guard to ensure we only check GroupColumn types
        .some(childGroup => isColumnInGroupTree(possibleDescendant, childGroup)); // Recursive call for group columns
}

export function isCellComponent(value: any): value is CustomCellComponentWithProps {
    return value && typeof value === 'object' && 'component' in value
}


export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    }) as T;
}



