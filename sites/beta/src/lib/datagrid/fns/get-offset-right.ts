import type { BaseColumn, ColumnId } from "../types";

/**
 * Calculates the right offset of a specific column based on pinned right columns.
 *
 * @param id - The ID of the column for which to calculate the offset.
 * @param columns - An array of column definitions.
 * @returns The right offset in pixels as a string (e.g., '0px', '50px').
 */
export const getOffsetRight = <T>(id: ColumnId<T>, columns: BaseColumn<T>[]): string => {
    // Filter columns that are visible and pinned to the right
    const pinnedRightColumns = columns.filter(
        (column) => column.visible !== false && column.pinned?.position === 'right'
    );

    // Find the index of the column with the specified ID
    const index = pinnedRightColumns.findIndex((column) => column.id === id);
    const lastIndex = pinnedRightColumns.length - 1;

    // If the specified column is the last pinned right column, return '0px'
    if (index === lastIndex) {
        return '0px';
    }

    // Sum up the widths of the columns to the right of the specified column
    const widthSumOfNextIndexes = pinnedRightColumns
        .slice(index + 1) // Get all columns after the specified column
        .reduce((sum, column) => {
            const width = parseFloat(column.width || '0'); // Parse width; default to 0 if missing
            return sum + width; // Accumulate the total width
        }, 0);

    return `${widthSumOfNextIndexes}px`; // Return the total width as a string
};
