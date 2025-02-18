import type { SelectionRange } from "../../types";





type IsCellSelectedToAdd = {
    rowIndex: number;
    columnIndex: number;
    selectionsToBeAdded: SelectionRange;
};

export function isCellSelectedToAdd({
    rowIndex,
    columnIndex,
    selectionsToBeAdded
}: IsCellSelectedToAdd): boolean {
    return selectionsToBeAdded.has(`${rowIndex}-${columnIndex}`);
}