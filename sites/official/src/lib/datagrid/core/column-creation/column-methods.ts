import type { AnyColumn } from "./types";

export const isColumnVisible = (column: AnyColumn<any>): boolean => {
    return column.state.visible === true;
}

export const isColumnSortable = (column: AnyColumn<any>): boolean => {
    if (column.options.sortable !== null || column.options.sortable !== false) {
        return true
    }
    return false
}

export const isColumnFilterable = (column: AnyColumn<any>): boolean => {
    if (column.options.filterable !== null || column.options.filterable !== false) {
        return true
    }
    return false
}