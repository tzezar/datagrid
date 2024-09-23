import type { SelectionRange } from "../../types";


type IsCellSelected = {
    rowIndex: number;
    columnIndex: number;
    selectionRange: SelectionRange;
};

export function isCellSelected({
    rowIndex,
    columnIndex,
    selectionRange
}: IsCellSelected): boolean {
    return selectionRange.has(`${rowIndex}-${columnIndex}`);
}