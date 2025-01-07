import {  type AnyColumn,type GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { flattenColumns } from "../utils.svelte";

// Add to your existing ColumnOrdering class
export class ColumnOrderingFeature<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }


    moveColumnLeft(column: AnyColumn<TOriginalRow>): void {
        if (this.datagrid.columnGrouping.isColumnWithinGroup(column)) {
            const parentGroupColumn = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
            if (parentGroupColumn === null) return;
            const columnsInGroup = parentGroupColumn.columns;
            const index = columnsInGroup.findIndex(col => col === column);
            if (index === 0) return;
            if (index === -1) return;
            const [columnToMove] = columnsInGroup.splice(index, 1);
            columnsInGroup.splice(index - 1, 0, columnToMove);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
            return;
        }

        // Move column to the previous position
        const index = this.datagrid.columns.findIndex(col => col === column);
        if (index === 0) return;
        if (index === -1) return;

        const [columnToMove] = this.datagrid.columns.splice(index, 1);
        this.datagrid.columns.splice(index - 1, 0, columnToMove);
        this.datagrid.processors.column.refreshColumnPinningOffsets();

    }

    moveColumnRight(column: AnyColumn<TOriginalRow>): void {
        if (this.datagrid.columnGrouping.isColumnWithinGroup(column)) {
            const parentGroupColumn = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
            if (parentGroupColumn === null) return;
            const columnsInGroup = parentGroupColumn.columns;
            const index = columnsInGroup.findIndex(col => col === column);
            // Fixed the boundary check to use columnsInGroup length instead of datagrid.columns
            if (index === columnsInGroup.length - 1) return;
            if (index === -1) return;
            const [columnToMove] = columnsInGroup.splice(index, 1);
            columnsInGroup.splice(index + 1, 0, columnToMove);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
            return;
        }

        // Move column to the next position
        const index = this.datagrid.columns.findIndex(col => col === column);
        if (index === this.datagrid.columns.length - 1) return;
        if (index === -1) return;
        const [columnToMove] = this.datagrid.columns.splice(index, 1);
        this.datagrid.columns.splice(index + 1, 0, columnToMove);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    moveColumnToGroup(column: AnyColumn<TOriginalRow>, targetGroupColumnId: string): void {
        // Handle move to root level case
        if (targetGroupColumnId === '') {
            const currentGroup = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
            if (currentGroup) {
                // Remove from current group
                const columnIndex = currentGroup.columns.findIndex(col => col === column);
                if (columnIndex !== -1) {
                    currentGroup.columns.splice(columnIndex, 1);
                }
                // Reset parent column ID
                column.parentColumnId = null;  // Changed from '' to null to match isColumnWithinGroup check
                // Add to root level columns
                this.datagrid.columns.push(column);
            }
            this.datagrid.processors.column.refreshColumnPinningOffsets();
            return;
        }

        // Find target group column
        const targetGroupColumn = flattenColumns(this.datagrid.columns)
            .find(col => col.columnId === targetGroupColumnId) as GroupColumn<TOriginalRow>;
        
        if (!targetGroupColumn) {
            console.warn(`Target group column ${targetGroupColumnId} not found`);
            return;
        }

        // Handle current group removal
        if (column.parentColumnId !== null) {  // Changed from truthy check to explicit null check
            const currentGroup = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
            if (currentGroup) {
                const columnIndex = currentGroup.columns.findIndex(col => col === column);
                if (columnIndex !== -1) {
                    currentGroup.columns.splice(columnIndex, 1);
                }
            }
        } else {
            // Remove from root level if it's there
            const rootIndex = this.datagrid.columns.findIndex(col => col === column);
            if (rootIndex !== -1) {
                this.datagrid.columns.splice(rootIndex, 1);
            }
        }

        // Update column's parent ID
        column.parentColumnId = targetGroupColumn.columnId;
        
        // Add to target group
        targetGroupColumn.columns.push(column);

        // Refresh layout
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }


}