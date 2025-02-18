import type { SelectionState } from "../../types";



type HandleMouseDown = {
    e: MouseEvent;
    rowIndex: number;
    columnIndex: number;
    selectionState: SelectionState
};


export function handleMouseDown({
    e,
    rowIndex,
    columnIndex,
    selectionState,
}: HandleMouseDown) {
    // select htmlelemtn having class 'td'
    document.querySelectorAll('.td').forEach((element) => {
        element.classList.add('cell');
    });

    if (e.ctrlKey && e.shiftKey) {
        // e.preventDefault();
        selectionState.isMouseDown = true;
        selectionState.isRemoving = true;
        selectionState.start = { rowIndex, columnIndex };
        selectionState.end = { rowIndex, columnIndex };
    } else if (e.ctrlKey) {
        // e.preventDefault();

        selectionState.isMouseDown = true;
        selectionState.isSelecting = true;
        selectionState.start = { rowIndex, columnIndex };
        selectionState.end = { rowIndex, columnIndex };
    } else {
        // Clear selection if no modifier keys are pressed
        selectionState.activeRange.clear();
        selectionState.range.clear()
        selectionState.start = null;
        selectionState.end = null;
        selectionState.isMouseDown = false;
        selectionState.isRemoving = false;
        selectionState.isSelecting = false;
    }

    return selectionState

}
