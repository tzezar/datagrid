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

export class ColumnOrderingFeature<TOriginalRow = any> implements IColumnOrderingFeature {
    private readonly datagrid: DatagridCore<TOriginalRow>;

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnOrderingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    move(columnId: ColumnId, direction: ColumnMovementDirection): void {
        this.datagrid.events.emit('onColumnReorder', { columnId, direction });
        this.moveColumn(columnId, direction);
    }

    // private moveLeft(columnId: ColumnId): void {
    //     this.moveColumn(columnId, 'left');
    // }

    // private moveRight(columnId: ColumnId): void {
    //     this.moveColumn(columnId, 'right');
    // }

    private getColumnIndex(columns: ColumnDef<TOriginalRow>[], columnId: ColumnId): number {
        const index = columns.findIndex(col => col.columnId === columnId);
        if (index === -1) {
            throw new Error(`Column ${columnId} not found in columns array`);
        }
        return index;
    }


    private moveColumn(columnId: ColumnId, direction: ColumnMovementDirection): void {
        const column = this.findColumnOrThrow(columnId);
        const moveOperation = this.calculateMoveOperation(column, direction);

        this.validateMove(moveOperation);
        this.executeMove(moveOperation);
        this.refreshColumnState();
    }

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


    private calculateMoveOperation(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
        const isRoot = column.parentColumnId === null;
        return isRoot
            ? this.calculateRootLevelMove(column, direction)
            : this.calculateGroupLevelMove(column, direction);
    }

    private calculateRootLevelMove(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
        const currentIndex = this.getColumnIndex(this.datagrid._columns, column.columnId);
        const targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= this.datagrid._columns.length) {
            throw new Error('Cannot move column outside bounds');
        }

        const targetColumn = this.datagrid._columns[targetIndex];

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


    private calculateGroupLevelMove(column: ColumnDef<TOriginalRow>, direction: ColumnMovementDirection): MoveOperation {
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
     * Refreshes the column state
     */
    refreshColumnState(): void {
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }


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


    validateMove(operation: MoveOperation): void {
        const { sourceColumn, targetLocation } = operation;

        if (sourceColumn.type === 'group' && targetLocation.parentId) {
            const targetGroup = this.findParentGroupOrThrow(targetLocation.parentId);
            if (this.wouldCreateCircularReference(sourceColumn, targetGroup)) {
                throw new Error('Cannot move a group into its own descendant');
            }
        }
    }


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