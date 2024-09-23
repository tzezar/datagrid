import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

export const toggleColumnPin = <T>(columnId: string, position: 'left' | 'right', columns: BaseColumn<T>[]) => {
    // Create a new columns array with the updated pinned state
    columns = columns.map((column) =>
        column.id === columnId
            ? {
                ...column,
                pinned: column.pinned?.position === position ? undefined : { position }
            }
            : column
    );
    applyOffset(columns);
    return columns;
}