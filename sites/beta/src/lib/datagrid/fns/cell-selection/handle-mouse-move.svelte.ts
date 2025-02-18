import type { SelectionState } from "../../types";
import { updateSelection } from "./update-selection";

type HandleMouseMove = {
    rowIndex: number;
    columnIndex: number;
    selectionState: SelectionState
};


export const handleMouseMove = ({
    rowIndex,
    columnIndex,
    selectionState,
}: HandleMouseMove): SelectionState => {


    if (selectionState.isMouseDown && selectionState.start) {
        selectionState.end = { rowIndex, columnIndex };
        if (selectionState.isSelecting) {
            return {
                ...selectionState,
                end: selectionState.end,
                activeRange: updateSelection({
                    selectionRange: selectionState.activeRange,
                    selectionStart: selectionState.start,
                    selectionEnd: selectionState.end
                })
            }
        } else if (selectionState.isRemoving) {
            return {
                ...selectionState,
                end: selectionState.end,
                activeRange: updateSelection({
                    selectionRange: selectionState.activeRange,
                    selectionStart: selectionState.start,
                    selectionEnd: selectionState.end
                })
            }
        }
    }

    return selectionState
};
