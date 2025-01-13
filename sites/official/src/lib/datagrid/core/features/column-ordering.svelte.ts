import { type AnyColumn, type GroupColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
import { findColumnById, findColumnByIdWithNestedColumns } from "../utils.svelte";

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
        this.moveLeafColumn(columnId, 'left');
    }

    moveRight(columnId: ColumnId): void {
        this.moveLeafColumn(columnId, 'right');
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
    private moveLeafColumn(columnId: ColumnId, direction: 'left' | 'right'): void {
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
            this.removeLeafColumnFromGroup(currentGroup, column);

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



    moveColumnToPosition(columnId: ColumnId, targetId: ColumnId): void {
        const column = findColumnByIdWithNestedColumns(this.datagrid.columns, columnId);
        if (!column) return;
        if (column.type === 'group') this.moveGroupColumnToPosition(column, targetId);
        else this.moveLeafColumnToPosition(column, targetId);
    }

    moveLeafColumnToPosition(column: LeafColumn<any>, targetId: ColumnId): void {
        if (targetId === '') {
            this.moveLeafColumnToRoot(column);
            return;
        }
        const targetColumn = findColumnByIdWithNestedColumns(this.datagrid.columns, targetId);
        if (!targetColumn) return;
        if (targetColumn.type === 'group') this.moveLeafColumnToGroup(column, targetColumn);
    }

    moveGroupColumnToPosition(column: GroupColumn<any>, targetId: ColumnId): void {
        if (targetId === '') {
            this.moveGroupColumnToRoot(column);
            return;
        }
        const targetColumn = findColumnByIdWithNestedColumns(this.datagrid.columns, targetId);
        if (!targetColumn) return;
        if (column.columnId === targetColumn.columnId) return
        if (targetColumn.type === 'group') this.moveGroupColumnToGroup(column, targetColumn);
    }

    moveLeafColumnToRoot(column: LeafColumn<any>): void {
        // Is already in root
        if (column.parentColumnId === null) return;

        const parentGroup = findColumnByIdWithNestedColumns(this.datagrid.columns, column.parentColumnId as string) as GroupColumn<any>;
        if (!parentGroup) return;

        this.removeLeafColumnFromGroup(column, parentGroup);
        this.addLeafColumnToRoot(column);

    }

    moveGroupColumnToRoot(column: GroupColumn<any>): void {
        // Is already in root
        if (column.parentColumnId === '') return;

        const parentGroup = findColumnByIdWithNestedColumns(this.datagrid.columns, column.parentColumnId as string) as GroupColumn<any>;
        if (!parentGroup) return;

        this.removeGroupColumnFromGroup(column, parentGroup);
        this.addGroupColumnToRoot(column);

    }


    moveLeafColumnToGroup(column: LeafColumn<any>, group: GroupColumn<any>): void {
        // if (this.isDescendant(column, group)) return;

        if (column.parentColumnId === null) {
            console.log('removeLeafColumnFromRoot')
            this.removeLeafColumnFromRoot(column);
            this.addLeafColumnToGroup(column, group);
            return
        }
        console.log('removeLeafColumnFromGroup')
        const parentGroup = findColumnByIdWithNestedColumns(this.datagrid.columns, column.parentColumnId) as GroupColumn<any>;
        this.removeLeafColumnFromGroup(column, parentGroup);
        this.addLeafColumnToGroup(column, group);

    }

    moveGroupColumnToGroup(column: GroupColumn<any>, targetGroup: GroupColumn<any>): void {
        if (this.movingToOwnChildren(column, targetGroup)) return;

        if (column.parentColumnId === null) {
            this.removeGroupColumnFromRoot(column);
            this.addGroupColumnToGroup(column, targetGroup);
            return
        }
        const parentGroup = findColumnByIdWithNestedColumns(this.datagrid.columns, column.parentColumnId as string) as GroupColumn<any>;
        this.removeGroupColumnFromGroup(column, parentGroup);
        this.addGroupColumnToGroup(column, targetGroup);
    }


    private movingToOwnChildren(group: GroupColumn<any>, target: GroupColumn<any>): boolean {
        for (const col of group.columns) {
            if (col.columnId === target.columnId) {
                return true; // Found the target column
            }
            if (col.type === 'group' && this.movingToOwnChildren(col, target)) {
                return true; // Recursively check nested groups
            }
        }
        return false; // Return false if no match is found
    }

    removeLeafColumnFromGroup(column: LeafColumn<any>, group: GroupColumn<any>): void {

        group.columns = group.columns.filter(c => c.columnId !== column.columnId);
    }

    removeGroupColumnFromGroup(column: GroupColumn<any>, group: GroupColumn<any>): void {
        group.columns = group.columns.filter(c => c.columnId !== column.columnId);
        console.log('group new', $state.snapshot(group))
    }

    removeLeafColumnFromRoot(column: LeafColumn<any>): void {
        const newColumns = this.datagrid.columns.filter(c => c.columnId !== column.columnId);
        this.datagrid.columns = newColumns;
    }

    removeGroupColumnFromRoot(column: GroupColumn<any>): void {
        const newColumns = this.datagrid.columns.filter(c => c.columnId !== column.columnId);
        this.datagrid.columns = newColumns;
    }


    addLeafColumnToRoot(column: LeafColumn<any>): void {
        this.datagrid.columns.push(column);
        column.parentColumnId = null;
    }

    addGroupColumnToRoot(column: GroupColumn<any>): void {
        this.datagrid.columns.push(column);
        column.parentColumnId = null;
    }

    addLeafColumnToGroup(column: LeafColumn<any>, group: GroupColumn<any>): void {
        group.columns.push(column);
        column.parentColumnId = group.columnId;
    }
    addGroupColumnToGroup(column: GroupColumn<any>, group: GroupColumn<any>): void {
        group.columns.push(column);
        column.parentColumnId = group.columnId;
    }



}
