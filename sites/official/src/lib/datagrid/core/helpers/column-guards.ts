import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "../column-creation/types";

export function isGroupColumn<TData>(column: AnyColumn<TData>): column is GroupColumn<TData> {
    return column.type === 'group'
}

export function isAccessorColumn<TData>(column: AnyColumn<TData>): column is AccessorColumn<TData> {
    return column.type === 'accessor';
}

export function isComputedColumn<TData>(column: AnyColumn<TData>): column is ComputedColumn<TData> {
    return column.type === 'computed';
}

export function isDisplayColumn<TData>(column: AnyColumn<TData>): column is DisplayColumn<TData> {
    return column.type === 'display';
}