// Focus a specific cell or its child (if any focusable child exists)

import type { BaseColumn } from "../../types";
import { focusCell } from "./focus-cell";

// Handle keyboard navigation
export const handleKeyDown = <T>({ event, focusedRowIndex, focusedColumnIndex, visibleData, columns, identifier }: {
    event: KeyboardEvent,
    focusedRowIndex: number,
    focusedColumnIndex: number,
    visibleData: T[],
    columns: BaseColumn<T>[],
    identifier: string
}) => {
    event.preventDefault()
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            focusedRowIndex = Math.max(focusedRowIndex - 1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            focusedRowIndex = Math.min(focusedRowIndex + 1, visibleData.length - 1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            focusedColumnIndex = Math.max(focusedColumnIndex - 1, 0);
            break;
        case 'ArrowRight':
            event.preventDefault();
            focusedColumnIndex = Math.min(focusedColumnIndex + 1, columns.length - 1);
            break;
        case 'Enter':
            // Trigger any specific action, like selecting a cell
            break;
    }
    focusCell({
        columnIndex: focusedColumnIndex,
        rowIndex: focusedRowIndex,
        identifier
    });
}

export type HandleKeyDown = typeof handleKeyDown