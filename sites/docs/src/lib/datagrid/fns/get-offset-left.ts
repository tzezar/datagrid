import type { BaseColumn, ColumnId } from "../types";

export const getOffsetLeft = <T>(id: ColumnId<T>, columns: BaseColumn<T>[]) => {
    // Filter columns pinned to the left
    const pinnedLeftColumns = columns
        .filter((column) => column.visible !== false)
        .filter((column) => column.pinned?.position === 'left');
    // Find the index of the column with the specified id
    const index = pinnedLeftColumns.findIndex((column) => column.id === id);

    // Return '0px' if the column is the first one pinned to the left or not found
    if (index === -1 || index === 0) {
        return '0px';
    }

    // Sum up the widths of all previous pinned left columns before the specified column
    let widthSumOfPreviousIndexes = 0;

    for (let i = 0; i < index; i++) {
        // Parse width as a float, default to 0px if not present
        const width = parseFloat(pinnedLeftColumns[i].width || '0');
        widthSumOfPreviousIndexes += width;
    }


    return `${widthSumOfPreviousIndexes}px`;
};
