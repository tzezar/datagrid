import { type AnyColumn, type GroupColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
import { createFlatColumnStructureAndPreserveChildren, findColumnById } from "../utils.svelte";

export class ColumnOrderingFeature<TOriginalRow> {
    private datagrid: DataGrid<TOriginalRow>;

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    moveLeft(columnId: ColumnId): void {
        // this.moveLeafColumn(columnId, 'left');
        this.moveColumn(columnId, 'left');
    }

    moveRight(columnId: ColumnId): void {
        // this.moveLeafColumn(columnId, 'right');
        this.moveColumn(columnId, 'right');
    }






    getColumnIndex(columns: AnyColumn<TOriginalRow>[], columnId: ColumnId): number {
        return columns.findIndex(col => col.columnId === columnId);
    }

    swapColumns(columns: AnyColumn<TOriginalRow>[], fromIndex: number, toIndex: number): void {
        const [columnToMove] = columns.splice(fromIndex, 1);
        columns.splice(toIndex, 0, columnToMove);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
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
    moveColumn(columnId: ColumnId, direction: 'left' | 'right'): void {
        const column = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);


        const insideGroup = column.parentColumnId !== null;

        if (insideGroup) this.moveColumnWithinGroup(columnId, direction);
        else this.moveColumnAtRootLevel(columnId, direction);


        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }




    moveColumnAtRootLevel(columnId: ColumnId, direction: 'left' | 'right'): void {
        const column = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);
        if (direction === 'right') {
            const columnIndex = this.getColumnIndex(this.datagrid.columns, columnId);
            const nextColumn = this.datagrid.columns[columnIndex + 1];
            if (nextColumn.type === 'group') {
                if (column.type === 'group') {
                    this.moveGroupColumnToGroup(column, nextColumn as GroupColumn<TOriginalRow>, 'left');
                } else {
                    this.moveLeafColumnToGroup(column, nextColumn as GroupColumn<TOriginalRow>, 'left');
                }
            } else {
                // Swap position with next column
                this.swapColumns(this.datagrid.columns, columnIndex, columnIndex + 1);
            }

        } else if (direction === 'left') {
            const columnIndex = this.getColumnIndex(this.datagrid.columns, columnId);
            const previousColumn = this.datagrid.columns[columnIndex - 1];
            if (previousColumn.type === 'group') {
                if (column.type === 'group') {
                    this.moveGroupColumnToGroup(column, previousColumn as GroupColumn<TOriginalRow>, 'right');
                } else {
                    this.moveLeafColumnToGroup(column, previousColumn as GroupColumn<TOriginalRow>, 'right');
                }
            } else {
                // Swap position with previous column
                this.swapColumns(this.datagrid.columns, columnIndex, columnIndex - 1);
            }
        } else {
            throw new Error('Invalid direction for root level movement');
        }
    }

    moveColumnWithinGroup(columnId: ColumnId, direction: 'left' | 'right'): void {
        const column = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);
    
        const parentGroup = this.datagrid.features.columnGrouping.findParentColumnGroupAndPreserveChildren(column.parentColumnId);
        if (!parentGroup) throw new Error('Parent group not found');
    
        const columnIndex = this.getColumnIndex(parentGroup.columns, columnId);
    
        if (direction === 'right') {
            const nextColumn = parentGroup.columns[columnIndex + 1];
    
            if (!nextColumn) {
                // Move one level up to the root level
                const parentGroupOneLevelUp = this.datagrid.features.columnGrouping.findParentColumnGroupAndPreserveChildren(parentGroup.parentColumnId);
                if (parentGroupOneLevelUp) {
                    const parentGroupIndexWithinOneLevelUp = this.getColumnIndex(parentGroupOneLevelUp.columns, parentGroup.columnId);
    
                    // Remove column from current group
                    parentGroup.columns = parentGroup.columns.filter(col => col.columnId !== column.columnId);
        
                    // Add column to the parent group after the current group
                    parentGroupOneLevelUp.columns.splice(parentGroupIndexWithinOneLevelUp + 1, 0, column);
        
                    // Update column's parent reference
                    column.parentColumnId = parentGroupOneLevelUp.columnId;
                } else if (!parentGroupOneLevelUp){
                    // throw new Error('Parent group one level up not found');
                    // moving to root after group

                    if (column.type === 'group') {
                        this.removeGroupColumnFromGroup(column, parentGroup);
                    } else {
                        this.removeLeafColumnFromGroup(column, parentGroup);
                    }
                    const parentGroupIndexWithinOneLevelUp = this.getColumnIndex(this.datagrid.columns, parentGroup.columnId);
                    this.datagrid.columns.splice(parentGroupIndexWithinOneLevelUp + 1, 0, column);
                    column.parentColumnId = null;
                } else {
                    throw new Error('Invalid parent group');
                }
            } else if (nextColumn.type === 'group') {
                // Move into the next group


                if (column.type === 'group') {
                    this.moveGroupColumnToGroup(column, nextColumn as GroupColumn<TOriginalRow>, 'left');
                } else {
                    this.moveLeafColumnToGroup(column, nextColumn as GroupColumn<TOriginalRow>, 'left');
                }
            } else {
                // Swap with the next column
                this.swapColumns(parentGroup.columns, columnIndex, columnIndex + 1);
            }
        } else if (direction === 'left') {
            const previousColumn = parentGroup.columns[columnIndex - 1];
    
            if (!previousColumn) {
                // Move one level up to the root level
                const parentGroupOneLevelUp = this.datagrid.features.columnGrouping.findParentColumnGroupAndPreserveChildren(parentGroup.parentColumnId);
                if (parentGroupOneLevelUp) {
                    if (!parentGroupOneLevelUp) throw new Error('Parent group one level up not found');
    
                    const parentGroupIndexWithinOneLevelUp = this.getColumnIndex(parentGroupOneLevelUp.columns, parentGroup.columnId);
        
                    // Remove column from current group
                    parentGroup.columns = parentGroup.columns.filter(col => col.columnId !== column.columnId);
        
                    // Add column to the parent group before the current group
                    parentGroupOneLevelUp.columns.splice(parentGroupIndexWithinOneLevelUp, 0, column);
        
                    // Update column's parent reference
                    column.parentColumnId = parentGroupOneLevelUp.columnId;
                } else if (!parentGroupOneLevelUp){
                    // moving to root after group
                    if (column.type === 'group') {
                        this.removeGroupColumnFromGroup(column, parentGroup);
                    } else {
                        this.removeLeafColumnFromGroup(column, parentGroup);
                    }
                    const parentGroupIndexWithinOneLevelUp = this.getColumnIndex(this.datagrid.columns, parentGroup.columnId);
                    this.datagrid.columns.splice(parentGroupIndexWithinOneLevelUp, 0, column);
                    column.parentColumnId = null;
                } else {
                    throw new Error('Invalid parent group');
                }
            } else if (previousColumn.type === 'group') {
                // Move into the previous group
                if (column.type === 'group') {
                    this.moveGroupColumnToGroup(column, previousColumn as GroupColumn<TOriginalRow>, 'right');
                } else {
                    this.moveLeafColumnToGroup(column, previousColumn as GroupColumn<TOriginalRow>, 'right');
                }
            } else {
                // Swap with the previous column
                this.swapColumns(parentGroup.columns, columnIndex, columnIndex - 1);
            }
        } else {
            throw new Error('Invalid direction for root level movement');
        }
    }


    moveColumnToPosition(columnId: ColumnId, targetId: ColumnId): void {
        const column = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), columnId);
        if (!column) return;
        if (column.type === 'group') this.moveGroupColumnToPosition(column, targetId);
        else this.moveLeafColumnToPosition(column, targetId);
    }

    moveLeafColumnToPosition(column: LeafColumn<any>, targetId: ColumnId): void {
        if (targetId === '') {
            this.moveLeafColumnToRoot(column);
            return;
        }
        const targetColumn = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), targetId);
        if (!targetColumn) return;
        if (targetColumn.type === 'group') this.moveLeafColumnToGroup(column, targetColumn);
    }

    moveGroupColumnToPosition(column: GroupColumn<any>, targetId: ColumnId): void {
        if (targetId === '') {
            this.moveGroupColumnToRoot(column);
            return;
        }
        const targetColumn = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), targetId);
        if (!targetColumn) return;
        if (column.columnId === targetColumn.columnId) return
        if (targetColumn.type === 'group') this.moveGroupColumnToGroup(column, targetColumn);
    }

    moveLeafColumnToRoot(column: LeafColumn<any>): void {
        // Is already in root
        if (column.parentColumnId === null) return;

        const parentGroup = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), column.parentColumnId as string) as GroupColumn<any>;
        if (!parentGroup) return;

        this.removeLeafColumnFromGroup(column, parentGroup);
        this.addLeafColumnToRoot(column);

    }

    moveGroupColumnToRoot(column: GroupColumn<any>): void {
        // Is already in root
        if (column.parentColumnId === '') return;

        const parentGroup = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), column.parentColumnId as string) as GroupColumn<any>;
        if (!parentGroup) return;

        this.removeGroupColumnFromGroup(column, parentGroup);
        this.addGroupColumnToRoot(column);

    }


    moveLeafColumnToGroup(column: LeafColumn<any>, group: GroupColumn<any>, direction: 'left' | 'right' = "right"): void {
        // if (this.isDescendant(column, group)) return;

        if (column.parentColumnId === null) {
            console.log('removeLeafColumnFromRoot')
            this.removeLeafColumnFromRoot(column);
            this.addLeafColumnToGroup(column, group, direction);
            return
        }
        console.log('removeLeafColumnFromGroup')
        const parentGroup = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), column.parentColumnId) as GroupColumn<any>;
        this.removeLeafColumnFromGroup(column, parentGroup);
        this.addLeafColumnToGroup(column, group, direction);

    }

    moveGroupColumnToGroup(column: GroupColumn<any>, targetGroup: GroupColumn<any>, direction: 'left' | 'right' = 'right'): void {
        if (this.movingToOwnChildren(column, targetGroup)) return;

        if (column.parentColumnId === null) {
            this.removeGroupColumnFromRoot(column);
            this.addGroupColumnToGroup(column, targetGroup, direction);
            return
        }
        const parentGroup = findColumnById(createFlatColumnStructureAndPreserveChildren(this.datagrid.columns), column.parentColumnId as string) as GroupColumn<any>;
        this.removeGroupColumnFromGroup(column, parentGroup);
        this.addGroupColumnToGroup(column, targetGroup, direction);
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

    addLeafColumnToGroup(column: LeafColumn<any>, group: GroupColumn<any>, direction: 'left' | 'right'): void {
        if (direction === 'right') {
            group.columns.push(column);
            column.parentColumnId = group.columnId;
        } else {
            group.columns.unshift(column);
            column.parentColumnId = group.columnId;
        }
    }
    addGroupColumnToGroup(column: GroupColumn<any>, group: GroupColumn<any>, direction: 'left' | 'right'): void {
        if (direction === 'right') {
            group.columns.push(column);
            column.parentColumnId = group.columnId;
        } else {
            group.columns.unshift(column);
            column.parentColumnId = group.columnId;
        }
    }

}
