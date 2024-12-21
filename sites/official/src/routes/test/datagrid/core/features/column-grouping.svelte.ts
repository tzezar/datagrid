import { createColumnGroup, type GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";



export class ColumnGrouping<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    generateRandomColumnId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    createGroupColumn(header: string, parentColumnId: string | null): void {
        const groupColumn = createColumnGroup({
            header,
            columnId: this.generateRandomColumnId(),
            parentColumnId,
            columns: [],
        });
        this.datagrid.columns.push(groupColumn as GroupColumn<TOriginalRow>);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
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
            const parentGroup = this.datagrid.columnOrdering.findParentGroup(groupColumn.parentColumnId);
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