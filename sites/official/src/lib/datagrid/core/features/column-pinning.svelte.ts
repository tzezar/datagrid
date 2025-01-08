import type { AnyColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import type { ColumnId, PinningPosition } from "../types";

export class ColumnPinningFeature {
    datagrid: Datagrid<any>;

    constructor(datagrid: Datagrid<any>) {
        this.datagrid = datagrid;
    }

    changeColumnPinningPosition(column: AnyColumn<any>, position: PinningPosition) {
        column.state.pinning.position = position;
    }



    // // changeColumnPinningPosition(column: AnyColumn<any>, position: PinningPosition) {
    // //     if (position === 'left') {
    // //         this.leftPinnedColumns.add(column.columnId);
    // //         this.rightPinnedColumns.delete(column.columnId);
    // //     } else if (position === 'right') {
    // //         this.rightPinnedColumns.add(column.columnId);
    // //         this.leftPinnedColumns.delete(column.columnId);
    // //     } else {
    // //         this.leftPinnedColumns.delete(column.columnId);
    // //         this.rightPinnedColumns.delete(column.columnId);
    // //     }
    // // }


    // changeColumnPinningPosition(column: AnyColumn<any>, position: PinningPosition) {
    //     column.state.pinning.position = position;
    // }


    getOffset = (columnId: ColumnId, position: 'left' | 'right' | null): number => {
        if (position === null) return -1
        // Filter columns that are visible and pinned to the specified position
        const pinnedColumns = this.datagrid.columnManager.getLeafColumns().filter(
            (column) => column.state.visible !== false && column.state.pinning.position === position
        );

        // Find the index of the column with the specified ID
        const index = pinnedColumns.findIndex((column) => column.columnId === columnId);
        // If the column is the first in the pinned list or not found, return '0px'
        if (index === -1 || index === 0) {
            return 0
        }

        // Sum up the widths of all previous columns in the pinned list before the specified column
        const widthSumOfPreviousIndexes = pinnedColumns
            .slice(0, index) // Get all columns before the specified column
            .reduce((sum, column) => {
                const width = column.state.size.width || 0 // Parse width; default to 0 if missing
                return sum + width; // Accumulate the total width
            }, 0);
            

        return widthSumOfPreviousIndexes; // Return the total width as a string
    };

  
}