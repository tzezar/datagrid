
import { type AnyColumn, type GroupColumn } from "../column-creation/types";
import { isGroupColumn } from "../column-guards";
import type { Datagrid } from "../index.svelte";


export class ColumnGroupingFeature<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }


    getGroupColumns(): GroupColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getFlatColumns().filter(col => isGroupColumn(col));

    }


    findParentColumnGroup(parentColumnId: string | null): GroupColumn<TOriginalRow> | null {
        if (parentColumnId === null) return null;
        const flattenedColumns = this.datagrid.columnManager.getFlatColumns();
        const groupColumn = flattenedColumns.find(col => col.columnId === parentColumnId);
        if (groupColumn) {
            return groupColumn as GroupColumn<TOriginalRow>;
        }
        return null
    }
    
    isColumnWithinGroup(column: AnyColumn<TOriginalRow>): boolean {
        return column.parentColumnId !== null;
    }




    renameGroupColumn(column: any, newHeader: string): void {
        column.header = newHeader;
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    deleteGroupColumn(groupColumn: GroupColumn<TOriginalRow>): void {
        // Get the children columns that need to be moved
        const childColumns = [...groupColumn.columns];

        if (groupColumn.parentColumnId === null) {
            // Group is at root level
            // Remove the group from root level columns
            const groupIndex = this.datagrid.columns.findIndex(col => col === groupColumn);
            if (groupIndex !== -1) {
                this.datagrid.columns.splice(groupIndex, 1);

                // Move all children to root level
                childColumns.forEach(childColumn => {
                    childColumn.parentColumnId = null;
                    this.datagrid.columns.splice(groupIndex, 0, childColumn);
                });
            }
        } else {
            // Group is nested within another group
            const parentGroup = this.findParentColumnGroup(groupColumn.parentColumnId);
            if (parentGroup) {
                // Find and remove the group from its parent
                const groupIndex = parentGroup.columns.findIndex(col => col === groupColumn);
                if (groupIndex !== -1) {
                    parentGroup.columns.splice(groupIndex, 1);

                    // Move all children to the parent group
                    childColumns.forEach(childColumn => {
                        childColumn.parentColumnId = parentGroup.columnId;
                        parentGroup.columns.splice(groupIndex, 0, childColumn);
                    });
                }
            }
        }

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }
}