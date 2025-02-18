import type { BaseColumn, ColumnId } from "../types";

/**
 * Calculates the left offset of a specific column based on pinned left columns.
 *
 * @param id - The ID of the column for which to calculate the offset.
 * @param columns - An array of column definitions.
 * @returns The left offset in pixels as a string (e.g., '0px', '50px').
 */
export const getOffsetLeft = <T>(id: ColumnId<T>, columns: BaseColumn<T>[]): string => {
    // Filter columns that are visible and pinned to the left
    const pinnedLeftColumns = columns.filter(
        (column) => column.visible !== false && column.pinned?.position === 'left'
    );

    // Find the index of the column with the specified ID
    const index = pinnedLeftColumns.findIndex((column) => column.id === id);

    // If the column is the first pinned left column or not found, return '0px'
    if (index === -1 || index === 0) {
        return '0px';
    }

    // Sum up the widths of all previous pinned left columns before the specified column
    const widthSumOfPreviousIndexes = pinnedLeftColumns
        .slice(0, index) // Get all columns before the specified column
        .reduce((sum, column) => {
            const width = parseFloat(column.width || '0'); // Parse width; default to 0 if missing
            return sum + width; // Accumulate the total width
        }, 0);

    return `${widthSumOfPreviousIndexes}px`; // Return the total width as a string
};
