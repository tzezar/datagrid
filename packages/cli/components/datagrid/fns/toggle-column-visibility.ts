import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

export const toggleColumnVisibility = <T>(columnId: string, columns: BaseColumn<T>[]) => {
    columns = columns.map((column) => {
        if (column.id === columnId) {
            return { ...column, visible: !column.visible };
        }
        return column;
    });
    applyOffset(columns);
    return columns
};