import type { BaseColumn, ColumnId } from "../types";


export const getOffsetLeft = <T>(id: ColumnId<T>, columns: BaseColumn<T>[]) => {
    // Filter columns pinned to the left
    const pinnedLeftColumns = columns.filter((column)=> column.visible == true).filter((column) => column.pinned?.position === 'left');
    // Find the index of the column with the specified id
    const index = pinnedLeftColumns.findIndex((column) => column.id === id);

    // Return '0px' if the column is the first one pinned to the left
    if (index === 0) {
        return '0px';
    }

    // Sum up the widths of columns before the specified column
    let widthSumOfPreviousIndexes = 0;

    for (let i = 0; i < index; i++) {
        // Ensure the width is a valid number
        const width = parseFloat(pinnedLeftColumns[i].width || '0px') + 0.1
        widthSumOfPreviousIndexes += width
    }

    return `${widthSumOfPreviousIndexes}px`;
};
