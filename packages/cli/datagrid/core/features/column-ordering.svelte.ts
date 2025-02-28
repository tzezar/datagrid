import { type ColumnDef, type ColumnGroup } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";
import { findColumnById, flattenColumnStructurePreservingGroups } from "../utils.svelte";

export type ColumnMovementDirection = 'left' | 'right';

export interface MoveOperation {
    sourceColumn: ColumnDef<any>;
    targetLocation: {
        parentId: ColumnId | null;
        index: number;
    };
}

export type ColumnOrderingFeatureState = object
export type ColumnOrderingFeatureConfig = Partial<ColumnOrderingFeatureState>;
export type IColumnOrderingFeature = ColumnOrderingFeatureState

/**
 * Class responsible for managing column reordering within a data grid.
 * Handles both root-level and group-level column movements, validating moves,
 * and executing the reordering process.
 * 
 * @template TOriginalRow
 */
export class ColumnOrderingFeature<TOriginalRow = any> implements IColumnOrderingFeature {

    /**
     * The data grid instance to which this feature is attached.
     * @private
     * @type {DatagridCore<TOriginalRow>}
     */
    private readonly datagrid: DatagridCore<TOriginalRow>;

    /**
     * Initializes the column ordering feature with the provided data grid instance and optional configuration.
     * 
     * @param {DatagridCore<TOriginalRow>} datagrid - The data grid instance.
     * @param {ColumnOrderingFeatureConfig} [config] - Optional configuration for the feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnOrderingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Moves a column in the specified direction.
     * Emits a column reorder event and triggers the move.
     * 
     * @param {ColumnId} columnId - The ID of the column to be moved.
     * @param {ColumnMovementDirection} direction - The direction to move the column ('left' or 'right').
     */
    move(columnId: ColumnId, direction: ColumnMovementDirection): void {
        this.datagrid.events.emit('onColumnReorder', { columnId, direction });
        this.moveColumn(columnId, direction);
    }

    /**
     * Finds the index of a column in the columns array.
     * Throws an error if the column is not found.
     * 
     * @param {ColumnDef<TOriginalRow>[]} columns - The array of columns.
     * @param {ColumnId} columnId - The ID of the column to find.
     * @returns {number} The index of the column.
     * @throws {Error} If the column is not found in the array.
     */
    private getColumnIndex(columns: ColumnDef<TOriginalRow>[], columnId: ColumnId): number {
        const index = columns.findIndex(col => col.columnId === columnId);
        if (index === -1) {
            throw new Error(`Column ${columnId} not found in columns array`);
        }
        return index;
    }

    /**
     * Moves a column based on the specified direction.
     * Validates and executes the move.
     * 
     * @param {ColumnId} columnId - The ID of the column to move.
     * @param {ColumnMovementDirection} direction - The direction to move the column.
     */
    private moveColumn(columnId: ColumnId, direction: ColumnMovementDirection): void {
        const column = this.findColumnOrThrow(columnId);
        const moveOperation = this.calculateMoveOperation(column, direction);

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
        this.refreshColumnState();
    }

    /**
     * Finds a column by its ID and throws an error if not found.
     * 
     * @param {ColumnId} columnId - The ID of the column to find.
     * @returns {ColumnDef<TOriginalRow>} The found column.
     * @throws {Error} If the column is not found.
     */
    findColumnOrThrow(columnId: ColumnId): ColumnDef<TOriginalRow> {
        const column = findColumnById(
            flattenColumnStructurePreservingGroups(this.datagrid._columns),
            columnId
        );
        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }
        return column;
    }

    /**
     * Calculates the move operation for a column based on its type and movement direction.
     * 
     * @param {ColumnDef<TOriginalRow>} column - The column to move.
     * @param {ColumnMovementDirection} direction - The direction to move the column.
     * @returns {MoveOperation} The calculated move operation.
     */
    private calculateMoveOperation(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
        const isRoot = column.parentColumnId === null;
        return isRoot
            ? this.calculateRootLevelMove(column, direction)
            : this.calculateGroupLevelMove(column, direction);
    }

    /**
     * Calculates the move operation for a column at the root level.
     * 
     * @param {ColumnDef<TOriginalRow>} column - The column to move.
     * @param {ColumnMovementDirection} direction - The direction to move the column.
     * @returns {MoveOperation} The calculated move operation.
     */
    private calculateRootLevelMove(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
        const currentIndex = this.getColumnIndex(this.datagrid._columns, column.columnId);
        const targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= this.datagrid._columns.length) {
            throw new Error('Cannot move column outside bounds');
        }

        const targetColumn = this.datagrid._columns[targetIndex];
        if (!targetColumn) throw new Error('Target column not found');

        if (targetColumn.type === 'group') {
            return {
                sourceColumn: column,
                targetLocation: {
                    parentId: targetColumn.columnId,
                    index: direction === 'right' ? 0 : (targetColumn as ColumnGroup<TOriginalRow>).columns.length
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
     * Calculates the move operation for a column within a group.
     * 
     * @param {ColumnDef<TOriginalRow>} column - The column to move.
     * @param {ColumnMovementDirection} direction - The direction to move the column.
     * @returns {MoveOperation} The calculated move operation.
     */
    private calculateGroupLevelMove(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
        const parentGroup = this.findParentGroupOrThrow(column.parentColumnId as string);
        const currentIndex = this.getColumnIndex(parentGroup.columns, column.columnId);
        const targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        // Moving out of current group
        if (targetIndex < 0 || targetIndex >= parentGroup.columns.length) {
            return this.calculateGroupExitMove(column, parentGroup, direction);
        }

        const targetColumn = parentGroup.columns[targetIndex];
        if (!targetColumn) throw new Error('Target column not found');
        // Moving into adjacent group
        if (targetColumn.type === 'group') {
            return {
                sourceColumn: column,
                targetLocation: {
                    parentId: targetColumn.columnId,
                    index: direction === 'right' ? 0 : (targetColumn as ColumnGroup<TOriginalRow>).columns.length
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
     * Calculates the move operation when a column is moving out of its current group.
     * 
     * @param {ColumnDef<TOriginalRow>} column - The column to move.
     * @param {ColumnGroup<TOriginalRow>} currentGroup - The group the column is currently in.
     * @param {ColumnMovementDirection} direction - The direction to move the column.
     * @returns {MoveOperation} The calculated move operation.
     */
    private calculateGroupExitMove(
        column: ColumnDef<TOriginalRow>,
        currentGroup: ColumnGroup<TOriginalRow>,
        direction: ColumnMovementDirection
    ): MoveOperation {
        const parentGroup = currentGroup.parentColumnId
            ? this.findParentGroupOrThrow(currentGroup.parentColumnId)
            : null;

        const currentGroupIndex = parentGroup
            ? this.getColumnIndex(parentGroup.columns, currentGroup.columnId)
            : this.getColumnIndex(this.datagrid._columns, currentGroup.columnId);

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
     * Executes the move operation by removing the column from its current location
     * and inserting it into the new target location.
     * 
     * @param {MoveOperation} operation - The move operation to execute.
     */
    executeMove(operation: MoveOperation): void {
        const { sourceColumn, targetLocation } = operation;
        const sourceParentId = sourceColumn.parentColumnId;

        // Get source array (either root or parent group's columns)
        const sourceArray = sourceParentId === null
            ? this.datagrid._columns
            : this.findParentGroupOrThrow(sourceParentId).columns;

        // Get target array (either root or target group's columns)
        const targetArray = targetLocation.parentId === null
            ? this.datagrid._columns
            : this.findParentGroupOrThrow(targetLocation.parentId).columns;

        // Remove from source array
        const sourceIndex = sourceArray.indexOf(sourceColumn);
        if (sourceIndex === -1) {
            throw new Error('Source column not found in source array');
        }
        sourceArray.splice(sourceIndex, 1);

        // Update parent reference
        sourceColumn.parentColumnId = targetLocation.parentId;

        // Insert into target array
        targetArray.splice(targetLocation.index, 0, sourceColumn);
    }

    /**
     * Finds the parent group of a column by its ID and throws an error if not found.
     * 
     * @param {string} groupId - The ID of the parent group to find.
     * @returns {ColumnGroup<TOriginalRow>} The found parent group.
     * @throws {Error} If the group is not found or is not a group type.
     */
    private findParentGroupOrThrow(groupId: string): ColumnGroup<TOriginalRow> {
        const group = findColumnById(
            flattenColumnStructurePreservingGroups(this.datagrid._columns),
            groupId
        ) as ColumnGroup<TOriginalRow>;

        if (!group || group.type !== 'group') {
            throw new Error(`Group ${groupId} not found`);
        }

        return group;
    }

    /**
     * Refreshes the column state by recalculating the pinning offsets.
     */
    refreshColumnState(): void {
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Checks if moving a column would create a circular reference in a column group.
     * 
     * @param {ColumnGroup<TOriginalRow>} sourceGroup - The source group from which the column is being moved.
     * @param {ColumnGroup<TOriginalRow>} targetGroup - The target group into which the column is being moved.
     * @returns {boolean} True if moving the column would create a circular reference, false otherwise.
     */
    private wouldCreateCircularReference(
        sourceGroup: ColumnGroup<TOriginalRow>,
        targetGroup: ColumnGroup<TOriginalRow>
    ): boolean {
        let current: ColumnGroup<TOriginalRow> | null = targetGroup;

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
     * Validates the proposed move operation to ensure that it does not create invalid column relationships.
     * Specifically, checks that a group column is not moved into one of its own descendants, which would create a circular reference.
     *
     * @param {MoveOperation} operation The move operation to validate.
     * @throws {Error} Throws an error if the move would create a circular reference.
     */
    validateMove(operation: MoveOperation): void {
        const { sourceColumn, targetLocation } = operation;

        if (sourceColumn.type === 'group' && targetLocation.parentId) {
            const targetGroup = this.findParentGroupOrThrow(targetLocation.parentId);
            if (this.wouldCreateCircularReference(sourceColumn, targetGroup)) {
                throw new Error('Cannot move a group into its own descendant');
            }
        }
    }

    /**
     * Moves a column to the specified position relative to another column.
     * This could involve moving the column to the root position or within a group.
     *
     * @param {ColumnId} columnId The ID of the column to move.
     * @param {ColumnId} targetId The ID of the column to move the source column relative to.
     * @throws {Error} Throws an error if the column cannot be found or if invalid move operation is attempted.
     */
    moveToPosition(columnId: ColumnId, targetId: ColumnId): void {
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
            const moveOperation: MoveOperation = {
                sourceColumn: column,
                targetLocation: {
                    parentId: targetColumn.columnId,
                    index: 0
                }
            };

            this.validateMove(moveOperation);
            this.executeMove(moveOperation);
        }

        this.refreshColumnState();
    }

    /**
     * Moves a column to the root position, placing it at the end of the root-level columns.
     *
     * @param {ColumnDef<TOriginalRow>} column The column to move to the root position.
     * @throws {Error} Throws an error if the column cannot be found or if invalid move operation is attempted.
     */
    private moveToRoot(column: ColumnDef<TOriginalRow>): void {
        const moveOperation: MoveOperation = {
            sourceColumn: column,
            targetLocation: {
                parentId: null,
                index: this.datagrid._columns.length
            }
        };

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
    }
}
