import type { SelectionState } from "../../types";
import { addCellsToSelection } from "./add-cells-to-selection";
import { removeCellsFromSelection } from "./remove-cells-from-selection";

export type HandleMouseUp = {
    e: MouseEvent;
    rowIndex: number;
    columnIndex: number;
    selectionState: SelectionState
};

export const handleMouseUp = ({
    e,
    rowIndex,
    columnIndex,
    selectionState
}: HandleMouseUp) => {
    if (selectionState.isMouseDown) {
        selectionState.isMouseDown = false;
        selectionState.end = { rowIndex, columnIndex };
        window.getSelection()?.empty();
        // Update the last range's end point
    }
    if (e.ctrlKey && e.shiftKey) {
        selectionState.range = removeCellsFromSelection({
            selectionRange: selectionState.range,
            selectionEnd: selectionState.end,
            selectionStart: selectionState.start
        });
        selectionState.activeRange.clear();
        selectionState.isRemoving = false;
        window.getSelection()?.empty();
    } else if (e.ctrlKey) {
        selectionState.range = addCellsToSelection({ selectionEnd: selectionState.end, selectionRange: selectionState.range, selectionStart: selectionState.start });
        selectionState.activeRange.clear();
        selectionState.isSelecting = false;
    }
    return selectionState
};