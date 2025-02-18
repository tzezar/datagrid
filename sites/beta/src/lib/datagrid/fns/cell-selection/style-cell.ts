import type { SelectionState } from "../../types";
import { isCellSelected } from "./is-cell-selected";

type StyleCell = {
    rowIndex: number;
    columnIndex: number;
    selectionState: SelectionState
};

export const selectionStyleCell = ({
    rowIndex,
    columnIndex,
    selectionState,
}: StyleCell) => {
    if (selectionState.isSelecting && isCellSelected({
        rowIndex,
        columnIndex,
        selectionRange: selectionState.activeRange
    })) {
        return 'bg-green-50';
    } else if (selectionState.isRemoving && isCellSelected({
        columnIndex,
        rowIndex,
        selectionRange: selectionState.activeRange
    })) {
        return 'bg-red-50';
    } else if (isCellSelected({
        selectionRange: selectionState.range,
        columnIndex,
        rowIndex
    })) {
        return 'bg-blue-50';
    }
};