import type { SelectionRange } from "../../types";

type UpdateSelection = {
    selectionRange: SelectionRange;
    selectionStart: { rowIndex: number; columnIndex: number } | null;
    selectionEnd: { rowIndex: number; columnIndex: number } | null;
};


export function updateSelection({
    selectionRange,
    selectionStart,
    selectionEnd
}: UpdateSelection): SelectionRange {
    selectionRange.clear(); // Clear the old selection
    if (!selectionStart || !selectionEnd) {
        return selectionRange;
    }
    const { rowIndex: startRow, columnIndex: startCol } = selectionStart;
    const { rowIndex: endRow, columnIndex: endCol } = selectionEnd;

    // Iterate through the selection range to add selected cells
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            selectionRange.add(`${row}-${col}`);
        }
    }
    return selectionRange;
}