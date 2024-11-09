import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

/**
 * Moves a column within the columns array by swapping it with the adjacent column.
 *
 * @param index - The current index of the column to move.
 * @param direction - The direction to move the column: -1 for left, 1 for right.
 * @param columns - The array of columns to manipulate.
 * @returns The updated array of columns with the moved column.
 */
export function moveColumn<T>(index: number, direction: number, columns: BaseColumn<T>[]): BaseColumn<T>[] {
    const newIndex = index + direction;

    // Check if the new index is within bounds
    if (newIndex >= 0 && newIndex < columns.length) {
        // Swap columns
        [columns[index], columns[newIndex]] = [columns[newIndex], columns[index]];
    } else {
        console.warn(`Cannot move column from index ${index} to index ${newIndex}: out of bounds.`);
    }

    // Apply any additional offsets needed after the move
    applyOffset(columns);
    
    return columns;
}
