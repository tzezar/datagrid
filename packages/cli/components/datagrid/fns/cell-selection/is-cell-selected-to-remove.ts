import type { SelectionRange } from "../../types";

type IsCellSelectedToRemove = {
    rowIndex: number;
    columnIndex: number;
    selectionToBeRemoved: SelectionRange;
};

export function isCellSelectedToRemove({
    rowIndex,
    columnIndex,
    selectionToBeRemoved
}: IsCellSelectedToRemove): boolean {
    return selectionToBeRemoved.has(`${rowIndex}-${columnIndex}`);
}