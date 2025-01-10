import { type AnyColumn, type GroupColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId } from "../types";
import { findColumnById } from "../utils.svelte";

export class ColumnOrderingFeature<TOriginalRow> {
    private datagrid: DataGrid<TOriginalRow>;

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    private swapColumns(columns: AnyColumn<TOriginalRow>[], fromIndex: number, toIndex: number): void {
        const [columnToMove] = columns.splice(fromIndex, 1);
        columns.splice(toIndex, 0, columnToMove);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    private getColumnIndex(columns: AnyColumn<TOriginalRow>[], columnId: ColumnId): number {
        return columns.findIndex(col => col.columnId === columnId);
    }

    private isValidMove(columns: AnyColumn<TOriginalRow>[], index: number, targetIndex: number): boolean {
        return index !== -1 && targetIndex >= 0 && targetIndex < columns.length;
    }

    private moveWithinGroup(columnId: ColumnId, direction: -1 | 1): boolean {
        const column = findColumnById(this.datagrid.columns, columnId);
        if (!column || !this.datagrid.features.columnGrouping.isColumnWithinGroup(column)) return false;

        const parentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(column.parentColumnId);
        if (!parentGroup) return false;

        const columnsInGroup = parentGroup.columns;
        const index = this.getColumnIndex(columnsInGroup, columnId);
        const targetIndex = index + direction;

        if (!this.isValidMove(columnsInGroup, index, targetIndex)) return false;

        this.swapColumns(columnsInGroup, index, targetIndex);
        return true;
    }

    private moveAtRoot(columnId: ColumnId, direction: -1 | 1): void {
        const index = this.getColumnIndex(this.datagrid.columns, columnId);
        const targetIndex = index + direction;

        if (!this.isValidMove(this.datagrid.columns, index, targetIndex)) return;

        this.swapColumns(this.datagrid.columns, index, targetIndex);
    }

    // moveLeft(columnId: ColumnId): void {
    //     if (!this.moveWithinGroup(columnId, -1)) {
    //         this.moveAtRoot(columnId, -1);
    //     }
    // }

    // moveRight(columnId: ColumnId): void {
    //     if (!this.moveWithinGroup(columnId, 1)) {
    //         this.moveAtRoot(columnId, 1);
    //     }
    // }

    moveLeft(columnId: ColumnId): void {
        this.moveColumn(columnId, 'left');
    }

    moveRight(columnId: ColumnId): void {
        this.moveColumn(columnId, 'right');
    }


    // If the next column is a group, the column moves into the group at the start.
    // If already in a group:
    // Moves to the next column within the group.
    // If at the end of the group, moves out to the parent group or below the group in the next available position.
    // If at the root, moves to the next position in the root or into the next group if applicable.
    // Wraparound Logic:
    // If a column reaches the end of all groups and columns at a level, it should wrap to the next level or exit the group hierarchy.
  
    // example:
    // Column A starts at root level
    // First moves into Group 1 at beginning
    // Then moves right within Group 1
    // Then moves into Group 1.1
    // Moves within Group 1.1
    // Moves out to Group 1
    // Moves out to root level
    // Continues moving right at root level
    private moveColumn(columnId: ColumnId, direction: 'left' | 'right'): void {
        const column = findColumnById(this.datagrid.columns, columnId);
        if (!column) return;

        const moveWithinGroup = (group: GroupColumn<TOriginalRow>, currentIndex: number): boolean => {
            if (direction === 'right' && currentIndex < group.columns.length - 1) {
                const nextItem = group.columns[currentIndex + 1];
                if ((nextItem as GroupColumn<TOriginalRow>).columns) {
                    // If next item is a group, move into it at the beginning
                    const targetGroup = nextItem as GroupColumn<TOriginalRow>;
                    group.columns.splice(currentIndex, 1);
                    column.parentColumnId = targetGroup.columnId;
                    targetGroup.columns.unshift(column);
                } else {
                    // Otherwise swap within the group
                    this.swapColumns(group.columns, currentIndex, currentIndex + 1);
                }
                return true;
            } else if (direction === 'left' && currentIndex > 0) {
                const prevItem = group.columns[currentIndex - 1];
                if ((prevItem as GroupColumn<TOriginalRow>).columns) {
                    // If previous item is a group, move into it at the end
                    const targetGroup = prevItem as GroupColumn<TOriginalRow>;
                    group.columns.splice(currentIndex, 1);
                    column.parentColumnId = targetGroup.columnId;
                    targetGroup.columns.push(column);
                } else {
                    // Otherwise swap within the group
                    this.swapColumns(group.columns, currentIndex, currentIndex - 1);
                }
                return true;
            }
            return false;
        };

        const moveOutOfGroup = (currentGroup: GroupColumn<TOriginalRow>): void => {
            const parentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(currentGroup.parentColumnId);
            const indexInParent = parentGroup
                ? this.getColumnIndex(parentGroup.columns, currentGroup.columnId)
                : this.getColumnIndex(this.datagrid.columns, currentGroup.columnId);

            // Remove from current group
            this.removeFromGroup(currentGroup, column);

            if (parentGroup) {
                // Move to parent group
                column.parentColumnId = parentGroup.columnId;
                if (direction === 'right') {
                    parentGroup.columns.splice(indexInParent + 1, 0, column);
                } else {
                    parentGroup.columns.splice(indexInParent, 0, column);
                }
            } else {
                // Move to root level
                column.parentColumnId = null;
                if (direction === 'right') {
                    this.datagrid.columns.splice(indexInParent + 1, 0, column);
                } else {
                    this.datagrid.columns.splice(indexInParent, 0, column);
                }
            }
        };

        const currentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(column.parentColumnId);
        if (currentGroup) {
            const indexInGroup = this.getColumnIndex(currentGroup.columns, columnId);
            if (!moveWithinGroup(currentGroup, indexInGroup)) {
                moveOutOfGroup(currentGroup);
            }
        } else {
            // Handle root level movement
            const rootIndex = this.getColumnIndex(this.datagrid.columns, columnId);
            
            if (direction === 'right') {
                if (rootIndex < this.datagrid.columns.length - 1) {
                    const nextColumn = this.datagrid.columns[rootIndex + 1];
                    if ((nextColumn as GroupColumn<TOriginalRow>).columns) {
                        // Move into the next group at the beginning
                        const targetGroup = nextColumn as GroupColumn<TOriginalRow>;
                        this.datagrid.columns.splice(rootIndex, 1);
                        column.parentColumnId = targetGroup.columnId;
                        targetGroup.columns.unshift(column);
                    } else {
                        // Regular swap at root level
                        this.swapColumns(this.datagrid.columns, rootIndex, rootIndex + 1);
                    }
                }
            } else {
                if (rootIndex > 0) {
                    const prevColumn = this.datagrid.columns[rootIndex - 1];
                    if ((prevColumn as GroupColumn<TOriginalRow>).columns) {
                        // Move into the previous group at the end
                        const targetGroup = prevColumn as GroupColumn<TOriginalRow>;
                        this.datagrid.columns.splice(rootIndex, 1);
                        column.parentColumnId = targetGroup.columnId;
                        targetGroup.columns.push(column);
                    } else {
                        // Regular swap at root level
                        this.swapColumns(this.datagrid.columns, rootIndex, rootIndex - 1);
                    }
                }
            }
        }

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }
    


    moveColumnToGroup({
        columnId,
        targetGroupColumnId
    }: { columnId: ColumnId, targetGroupColumnId: string }): void {
        const column = findColumnById(this.datagrid.columns, columnId);
        if (!column) return;
        // Handle move to root level
        if (!targetGroupColumnId) {
            this.moveToRootLevel(column);
            return;
        }

        // Find target group column
        const targetGroupColumn = this.datagrid.columnManager.getFlatColumns()
            .find(col => col.columnId === targetGroupColumnId) as GroupColumn<TOriginalRow>;

        if (!targetGroupColumn) {
            console.warn(`Target group column ${targetGroupColumnId} not found`);
            return;
        }

        this.removeFromCurrentGroupOrRoot(column);
        column.parentColumnId = targetGroupColumn.columnId;
        targetGroupColumn.columns.push(column);

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    moveToRootLevel(column: AnyColumn<TOriginalRow>): void {
        const currentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(column.parentColumnId);
        if (currentGroup) {
            this.removeFromGroup(currentGroup, column);
        }

        column.parentColumnId = null;
        this.datagrid.columns.push(column);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    private removeFromCurrentGroupOrRoot(column: AnyColumn<TOriginalRow>): void {
        if (column.parentColumnId !== null) {
            const currentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(column.parentColumnId);
            if (currentGroup) {
                this.removeFromGroup(currentGroup, column);
            }
        } else {
            const rootIndex = this.datagrid.columns.findIndex(col => col === column);
            if (rootIndex !== -1) {
                this.datagrid.columns.splice(rootIndex, 1);
            }
        }
    }

    private removeFromGroup(group: GroupColumn<TOriginalRow>, column: AnyColumn<TOriginalRow>): void {
        const columnIndex = group.columns.findIndex(col => col === column);
        if (columnIndex !== -1) {
            group.columns.splice(columnIndex, 1);
        }
    }
}
