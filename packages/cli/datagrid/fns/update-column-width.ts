import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

export const updateColumnWidth = <T>(newWidth: string, columnId: string, columns: BaseColumn<T>[]) => {
    columns = columns.map((column) => {
        if (column.id === columnId) {
            return { ...column, width: `${newWidth}px` };
        }
        return column;
    });
    applyOffset(columns);
    return columns
};