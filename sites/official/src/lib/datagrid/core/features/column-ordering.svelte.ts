import { type AnyColumn, type GroupColumn } from "../column-creation/types";
import type { Datagrid } from "../index.svelte";
import type { ColumnId } from "../types";
import { findColumnById } from "../utils.svelte";

export class ColumnOrderingFeature<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
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
        if (!column || !this.datagrid.columnGrouping.isColumnWithinGroup(column)) return false;

        const parentGroup = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
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

    moveLeft(columnId: ColumnId): void {
        if (!this.moveWithinGroup(columnId, -1)) {
            this.moveAtRoot(columnId, -1);
        }
    }

    moveRight(columnId: ColumnId): void {
        if (!this.moveWithinGroup(columnId, 1)) {
            this.moveAtRoot(columnId, 1);
        }
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
        const currentGroup = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
        if (currentGroup) {
            this.removeFromGroup(currentGroup, column);
        }

        column.parentColumnId = null;
        this.datagrid.columns.push(column);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    private removeFromCurrentGroupOrRoot(column: AnyColumn<TOriginalRow>): void {
        if (column.parentColumnId !== null) {
            const currentGroup = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
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
