
import { type GroupColumn } from "../types";
import type { DataGrid } from "../index.svelte";
import { findColumnById, flattenColumnStructurePreservingGroups } from "../utils.svelte";


/**
 * Manages column grouping functionality for a data grid, including finding,
 * renaming, and deleting group columns, as well as handling column nesting.
 */
export class ColumnGroupingFeature<TOriginalRow = any> {
    // Reference to the parent DataGrid instance
    private datagrid: DataGrid<TOriginalRow>;

    /**
     * Initializes the column grouping feature for the given data grid.
     * @param datagrid - The DataGrid instance this feature is associated with.
     */
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    /**
        * Deletes a group column and reassigns its children to the appropriate level.
        * @param groupColumn - The group column to delete.
        */
    deleteGroupColumn(groupColumn: GroupColumn<TOriginalRow>): void {
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
            const parentGroup = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid.columns), groupColumn.parentColumnId) as GroupColumn<TOriginalRow>;
            if (!parentGroup) throw new Error('Parent group not found');
            if (parentGroup) {
                // Find and remove the group from its parent
                const groupIndex = parentGroup.columns.findIndex(col => col === groupColumn);
                if (groupIndex !== -1) {
                    parentGroup.columns.splice(groupIndex, 1);

                    // Move all children to the parent group
                    childColumns.forEach(childColumn => {
                        childColumn.parentColumnId = String(parentGroup.columnId);
                        parentGroup.columns.splice(groupIndex, 0, childColumn);
                    });
                }
            }
        }

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }
}