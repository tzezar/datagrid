import type { AccessorColumn, ColumnDef, ComputedColumn, DisplayColumn, ColumnGroup } from "../types";

export function isGroupColumn<TData>(column: ColumnDef<TData>): column is ColumnGroup<TData> {
    return column.type === 'group'
}

export function isAccessorColumn<TData>(column: ColumnDef<TData>): column is AccessorColumn<TData> {
    return column.type === 'accessor';
}

export function isComputedColumn<TData>(column: ColumnDef<TData>): column is ComputedColumn<TData> {
    return column.type === 'computed';
}

export function isDisplayColumn<TData>(column: ColumnDef<TData>): column is DisplayColumn<TData> {
    return column.type === 'display';
}