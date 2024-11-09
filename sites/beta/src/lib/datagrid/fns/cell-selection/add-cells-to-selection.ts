import type { SelectionPoint, SelectionRange } from "../../types";

type AddCellsToSelection = {
    selectionStart: SelectionPoint,
    selectionEnd: SelectionPoint
    selectionRange: SelectionRange
}

export function addCellsToSelection({ selectionEnd, selectionRange, selectionStart }: AddCellsToSelection
): SelectionRange {
    if (selectionStart && selectionEnd) {
        const { rowIndex: startRow, columnIndex: startCol } = selectionStart;
        const { rowIndex: endRow, columnIndex: endCol } = selectionEnd;

        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
            for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
                selectionRange.add(`${row}-${col}`);
            }
        }
    }

    return selectionRange;
}