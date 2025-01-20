import { type AnyColumn, type GroupColumn } from "../types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId, LeafColumn } from "../types";
import { flattenColumnStructurePreservingGroups, findColumnById } from "../utils.svelte";

type Direction = 'left' | 'right';

interface MoveOperation {
    sourceColumn: AnyColumn<any>;
    targetLocation: {
        parentId: ColumnId | null;
        index: number;
    };
}

export type ColumnOrderingFeatureConfig = {
}

/**
 * Manages column ordering functionality for a DataGrid.
 */
export class ColumnOrderingFeature<TOriginalRow> {
    private readonly datagrid: DataGrid<TOriginalRow>;

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initialize(config?: ColumnOrderingFeatureConfig) {
    }


    /**
     * Moves a column left in the column hierarchy
     */
    moveLeft(columnId: ColumnId): void {
        this.moveColumn(columnId, 'left');
    }

    /**
     * Moves a column right in the column hierarchy
     */
    moveRight(columnId: ColumnId): void {
        this.moveColumn(columnId, 'right');
    }

    /**
     * Finds the index of a column within an array of columns
     */
    private getColumnIndex(columns: AnyColumn<TOriginalRow>[], columnId: ColumnId): number {
        const index = columns.findIndex(col => col.columnId === columnId);
        if (index === -1) {
            throw new Error(`Column ${columnId} not found in columns array`);
        }
        return index;
    }

    /**
     * Swaps two columns in an array and updates pinning offsets
     */
    private swapColumns(columns: AnyColumn<TOriginalRow>[], fromIndex: number, toIndex: number): void {
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= columns.length || toIndex >= columns.length) {
            throw new Error('Invalid index for column swap');
        }

        const [columnToMove] = columns.splice(fromIndex, 1);
        columns.splice(toIndex, 0, columnToMove);
        this.refreshColumnState();
    }

    /**
     * Main method to handle column movement in any direction
     */
    private moveColumn(columnId: ColumnId, direction: Direction): void {
        const column = this.findColumnOrThrow(columnId);
        const moveOperation = this.calculateMoveOperation(column, direction);

        this.executeMove(moveOperation);
        this.refreshColumnState();
    }

    /**
     * Finds a column by ID or throws an error
     */
    private findColumnOrThrow(columnId: ColumnId): AnyColumn<TOriginalRow> {
        const column = findColumnById(
            flattenColumnStructurePreservingGroups(this.datagrid.columns),
            columnId
        );
        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }
        return column;
    }

    /**
     * Calculates the target location for a column move
     */
    private calculateMoveOperation(column: AnyColumn<TOriginalRow>, direction: Direction): MoveOperation {
        const isRoot = column.parentColumnId === null;
        return isRoot
            ? this.calculateRootLevelMove(column, direction)
            : this.calculateGroupLevelMove(column, direction);
    }

    /**
     * Calculates move operation for root-level columns
     */
    private calculateRootLevelMove(column: AnyColumn<TOriginalRow>, direction: Direction): MoveOperation {
        const currentIndex = this.getColumnIndex(this.datagrid.columns, column.columnId);
        const targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= this.datagrid.columns.length) {
            throw new Error('Cannot move column outside bounds');
        }

        const targetColumn = this.datagrid.columns[targetIndex];

        if (targetColumn.type === 'group') {
            return {
                sourceColumn: column,
                targetLocation: {
                    parentId: targetColumn.columnId,
                    index: direction === 'right' ? 0 : (targetColumn as GroupColumn<TOriginalRow>).columns.length
                }
            };
        }

        return {
            sourceColumn: column,
            targetLocation: {
                parentId: null,
                index: targetIndex
            }
        };
    }

    /**
     * Calculates move operation for group-level columns
     */
    private calculateGroupLevelMove(column: AnyColumn<TOriginalRow>, direction: Direction): MoveOperation {
        const parentGroup = this.findParentGroupOrThrow(column.parentColumnId as string);
        const currentIndex = this.getColumnIndex(parentGroup.columns, column.columnId);
        const targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        // Moving out of current group
        if (targetIndex < 0 || targetIndex >= parentGroup.columns.length) {
            return this.calculateGroupExitMove(column, parentGroup, direction);
        }

        const targetColumn = parentGroup.columns[targetIndex];

        // Moving into adjacent group
        if (targetColumn.type === 'group') {
            return {
                sourceColumn: column,
                targetLocation: {
                    parentId: targetColumn.columnId,
                    index: direction === 'right' ? 0 : (targetColumn as GroupColumn<TOriginalRow>).columns.length
                }
            };
        }

        // Simple swap within same group
        return {
            sourceColumn: column,
            targetLocation: {
                parentId: parentGroup.columnId,
                index: targetIndex
            }
        };
    }

    /**
     * Calculates move operation when exiting a group
     */
    private calculateGroupExitMove(
        column: AnyColumn<TOriginalRow>,
        currentGroup: GroupColumn<TOriginalRow>,
        direction: Direction
    ): MoveOperation {
        const parentGroup = currentGroup.parentColumnId
            ? this.findParentGroupOrThrow(currentGroup.parentColumnId)
            : null;

        const currentGroupIndex = parentGroup
            ? this.getColumnIndex(parentGroup.columns, currentGroup.columnId)
            : this.getColumnIndex(this.datagrid.columns, currentGroup.columnId);

        const targetIndex = direction === 'right' ? currentGroupIndex + 1 : currentGroupIndex;

        return {
            sourceColumn: column,
            targetLocation: {
                parentId: parentGroup?.columnId ?? null,
                index: targetIndex
            }
        };
    }

    /**
     * Executes a move operation
     */
    private executeMove(operation: MoveOperation): void {
        const { sourceColumn, targetLocation } = operation;

        // Remove from current location
        if (sourceColumn.parentColumnId === null) {
            this.removeFromRoot(sourceColumn);
        } else {
            this.removeFromGroup(sourceColumn);
        }

        // Add to new location
        if (targetLocation.parentId === null) {
            this.addToRoot(sourceColumn, targetLocation.index);
        } else {
            this.addToGroup(sourceColumn, targetLocation.parentId, targetLocation.index);
        }
    }

    /**
     * Finds a parent group column or throws an error
     */
    private findParentGroupOrThrow(groupId: string): GroupColumn<TOriginalRow> {
        const group = findColumnById(
            flattenColumnStructurePreservingGroups(this.datagrid.columns),
            groupId
        ) as GroupColumn<TOriginalRow>;

        if (!group || group.type !== 'group') {
            throw new Error(`Group ${groupId} not found`);
        }

        return group;
    }

    /**
     * Removes a column from the root level
     */
    private removeFromRoot(column: AnyColumn<TOriginalRow>): void {
        this.datagrid.columns = this.datagrid.columns.filter(c => c.columnId !== column.columnId);
    }

    /**
     * Removes a column from its parent group
     */
    private removeFromGroup(column: AnyColumn<TOriginalRow>): void {
        const parentGroup = this.findParentGroupOrThrow(column.parentColumnId as string);
        parentGroup.columns = parentGroup.columns.filter(c => c.columnId !== column.columnId);
    }

    /**
     * Adds a column to the root level at a specific index
     */
    private addToRoot(column: AnyColumn<TOriginalRow>, index: number): void {
        column.parentColumnId = null;
        this.datagrid.columns.splice(index, 0, column);
    }

    /**
     * Adds a column to a group at a specific index
     */
    private addToGroup(column: AnyColumn<TOriginalRow>, groupId: ColumnId, index: number): void {
        const group = this.findParentGroupOrThrow(groupId);
        column.parentColumnId = groupId;
        group.columns.splice(index, 0, column);
    }

    /**
     * Refreshes the column state
     */
    private refreshColumnState(): void {
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Checks if moving a group would create a circular reference
     */
    private wouldCreateCircularReference(
        sourceGroup: GroupColumn<TOriginalRow>,
        targetGroup: GroupColumn<TOriginalRow>
    ): boolean {
        let current: GroupColumn<TOriginalRow> | null = targetGroup;

        while (current) {
            if (current.columnId === sourceGroup.columnId) {
                return true;
            }
            current = current.parentColumnId
                ? this.findParentGroupOrThrow(current.parentColumnId)
                : null;
        }

        return false;
    }

    /**
     * Validates that a move operation is legal
     */
    private validateMove(operation: MoveOperation): void {
        const { sourceColumn, targetLocation } = operation;

        if (sourceColumn.type === 'group' && targetLocation.parentId) {
            const targetGroup = this.findParentGroupOrThrow(targetLocation.parentId);
            if (this.wouldCreateCircularReference(sourceColumn, targetGroup)) {
                throw new Error('Cannot move a group into its own descendant');
            }
        }
    }


    /**
    * Moves a column to a specific position identified by target column ID
    */
    moveColumnToPosition(columnId: ColumnId, targetId: ColumnId): void {
        const column = this.findColumnOrThrow(columnId);

        // Handle root position
        if (targetId === '') {
            this.moveToRoot(column);
            return;
        }

        const targetColumn = this.findColumnOrThrow(targetId);

        // Prevent moving to self
        if (column.columnId === targetColumn.columnId) {
            return;
        }

        // Handle group movement
        if (targetColumn.type === 'group') {
            if (column.type === 'group') {
                this.moveGroupColumnToPosition(column, targetColumn as GroupColumn<TOriginalRow>);
            } else {
                this.moveLeafColumnToPosition(column as LeafColumn<TOriginalRow>, targetColumn as GroupColumn<TOriginalRow>);
            }
        }

        this.refreshColumnState();
    }

    /**
     * Moves a leaf column to a specific position
     */
    private moveLeafColumnToPosition(column: LeafColumn<TOriginalRow>, targetGroup: GroupColumn<TOriginalRow>): void {
        // Validate the move
        const moveOperation: MoveOperation = {
            sourceColumn: column,
            targetLocation: {
                parentId: targetGroup.columnId,
                index: 0 // Add to beginning of group
            }
        };

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
    }

    /**
     * Moves a group column to a specific position
     */
    private moveGroupColumnToPosition(column: GroupColumn<TOriginalRow>, targetGroup: GroupColumn<TOriginalRow>): void {
        // Check for circular reference
        if (this.wouldCreateCircularReference(column, targetGroup)) {
            throw new Error('Cannot move a group into its own descendant');
        }

        // Create and validate move operation
        const moveOperation: MoveOperation = {
            sourceColumn: column,
            targetLocation: {
                parentId: targetGroup.columnId,
                index: 0 // Add to beginning of group
            }
        };

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
    }

    /**
     * Moves a column to the root level
     */
    private moveToRoot(column: AnyColumn<TOriginalRow>): void {
        const moveOperation: MoveOperation = {
            sourceColumn: column,
            targetLocation: {
                parentId: null,
                index: this.datagrid.columns.length // Add to end of root level
            }
        };

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
    }
}