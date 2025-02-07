import type { AnyColumn, GridRow, GroupColumn, LeafColumn } from "./types";
import type { CellValue, ColumnId, CustomCellComponentWithProps, SortableColumn } from "./types";
import type { DatagridCore } from "./index.svelte";
import { isGroupColumn } from "./helpers/column-guards";


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


export function flattenColumnStructure(
    columns: AnyColumn<any>[],
    preserveGroups: boolean = false
): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    const processColumns = (columns: AnyColumn<any>[], result: AnyColumn<any>[]) => {
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

export function flattenColumnStructureAndClearGroups(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    return flattenColumnStructure(columns, false);
}

export function flattenColumnStructurePreservingGroups(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    return flattenColumnStructure(columns, true);
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
export const getSortIndex = (datagrid: DatagridCore<any>, column: AnyColumn<any>): number | null => {
    column = column as SortableColumn<any>;
    if (!column.options.sortable) return null;
    const columnId = column.columnId || column.header;
    const sortConfig = datagrid.features.sorting.sortConfigs.find((config) => config.columnId === columnId);
    return sortConfig ? datagrid.features.sorting.sortConfigs.indexOf(sortConfig) + 1 : null;
};


export const getSortDirection = (datagrid: DatagridCore<any>, column: AnyColumn<any>): 'desc' | 'asc' | 'intermediate' | null => {
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


export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    }) as T;
}


export function flattenGridRows<TOriginalRow>(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
    const flattened: GridRow<TOriginalRow>[] = [];

    for (const row of data) {
        flattened.push(row);
        if (row.isGroupRow()) {
            flattened.push(...flattenGridRows(row.children));
        }
    }
    return flattened
}


export function getColumnsInOrder<TOriginalRow>(datagrid: DatagridCore): AnyColumn<TOriginalRow>[] {
    const getColumnsPinnedToLeft = (): AnyColumn<TOriginalRow>[] => {
        return flattenColumnStructureAndClearGroups(datagrid.columns).filter(col => col.state.pinning.position === 'left' || datagrid.features.grouping.groupByColumns.includes(col.columnId))
    }
    const getColumnsPinnedToRight = (): AnyColumn<TOriginalRow>[] => {
        return flattenColumnStructureAndClearGroups(datagrid.columns).filter(col => col.type !== 'group').filter(col => col.state.pinning.position === 'right')
    }
    const getColumnsPinnedToNone = (): AnyColumn<TOriginalRow>[] => {
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
        return flattenColumnStructureAndClearGroups(datagrid.columns).filter(col => col.state.pinning.position === 'none' && !datagrid.features.grouping.groupByColumns.includes(col.columnId))
    }

    const pinnedLeft = getColumnsPinnedToLeft()
    const pinnedNone = getColumnsPinnedToNone()
    const pinnedRight = getColumnsPinnedToRight()
    return [...pinnedLeft, ...datagrid.processors.column.createColumnHierarchy(pinnedNone), ...pinnedRight]
}

export function getLeafColumns<TOriginalRow>(datagrid: DatagridCore<TOriginalRow>): LeafColumn<TOriginalRow>[] {
    return flattenColumnStructureAndClearGroups(datagrid.columns).filter(col => col.type !== 'group')
}

export function getLeafColumnsInOrder<TOriginalRow>(datagrid: DatagridCore<TOriginalRow>): LeafColumn<TOriginalRow>[] {
    // let timeStart = performance.now();
    const cols = flattenColumnStructureAndClearGroups(getColumnsInOrder(datagrid)).filter(col => col.type !== 'group')
    // console.log(`getLeafColumnsInOrder took ${performance.now() - timeStart}ms`)
    return cols
}

export function getGroupColumns<TOriginalRow>(columns: AnyColumn<TOriginalRow>[]): GroupColumn<TOriginalRow>[] {
    return flattenColumnStructureAndClearGroups(columns).filter(col => isGroupColumn(col));
}
