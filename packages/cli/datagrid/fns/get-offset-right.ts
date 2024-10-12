import type { BaseColumn, ColumnId } from "../types";

export const getOffsetRight = <T>(id: ColumnId<T>, columns: BaseColumn<T>[]) => {
    // Find index of the column with the specified id and that is pinned to the right
    const pinnedRightColumns = columns.filter((column) => column.visible !== false).filter((column) => column.pinned?.position === 'right');
    const index = pinnedRightColumns.findIndex((column) => column.id === id);
    const lastIndex = pinnedRightColumns.length - 1;

    if (index === lastIndex) {
        return '0px';
    }

    // Sum up the widths of the columns to the right of the specified column
    let widthSumOfNextIndexes = 0;

    for (let i = index + 1; i < pinnedRightColumns.length; i++) {
        // Ensure the width is a valid number
        const width = parseFloat(pinnedRightColumns[i].width || '0px') + 0.1
        widthSumOfNextIndexes += width;
    }

    return `${widthSumOfNextIndexes}px`;
};
