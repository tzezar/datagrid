import type { SelectionPoint, SelectionRange } from "../../types";


type RemoveCellsFromSelection = {
    selectionStart: SelectionPoint,
    selectionEnd: SelectionPoint
    selectionRange: SelectionRange,
}

export function removeCellsFromSelection(
    {
        selectionEnd,
        selectionRange,
        selectionStart
    }: RemoveCellsFromSelection
): SelectionRange {
    if (selectionStart && selectionEnd) {
        const { rowIndex: startRow, columnIndex: startCol } = selectionStart;
        const { rowIndex: endRow, columnIndex: endCol } = selectionEnd;

        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
            for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
                selectionRange.delete(`${row}-${col}`);
            }
        }
        return selectionRange;
    }
    return selectionRange;
}