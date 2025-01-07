import { type AnyColumn, type GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { flattenColumns } from "../utils.svelte";

// Add to your existing ColumnOrdering class
export class ColumnOrderingFeature<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    moveColumnToStart(column: AnyColumn<TOriginalRow>): void {
        // Find the current position of grouped columns to determine insertion index
        const groupedColumnIds = this.datagrid.grouping.groupByColumns;
        const insertionIndex = groupedColumnIds.indexOf(column.columnId);
        
        // If column is not in a group, move it after grouped columns
        if (!this.datagrid.columnGrouping.isColumnWithinGroup(column)) {
            const columnIndex = this.datagrid.columns.findIndex(col => col === column);
            if (columnIndex !== -1) {
                const [columnToMove] = this.datagrid.columns.splice(columnIndex, 1);
                
                // If it's a grouped column, insert at its position in groupByColumns
                if (insertionIndex !== -1) {
                    this.datagrid.columns.splice(insertionIndex, 0, columnToMove);
                } else {
                    // If it's not grouped, insert after all grouped columns
                    const lastGroupedColumnIndex = this.findLastGroupedColumnIndex();
                    this.datagrid.columns.splice(lastGroupedColumnIndex + 1, 0, columnToMove);
                }
            }
            this.datagrid.processors.column.refreshColumnPinningOffsets();
            return;
        }

        // For grouped columns, we need to recreate the group hierarchy
        const groupHierarchy: GroupColumn<TOriginalRow>[] = [];
        let currentParentId = column.parentColumnId;
        
        // Build the group hierarchy from bottom to top
        while (currentParentId) {
            const parentGroup = this.datagrid.columnGrouping.findParentColumnGroup(currentParentId);
            if (!parentGroup) break;
            
            groupHierarchy.unshift(parentGroup);
            currentParentId = parentGroup.parentColumnId;
        }

        // Remove the column from its current position
        const originalParent = this.datagrid.columnGrouping.findParentColumnGroup(column.parentColumnId);
        if (originalParent) {
            const columnIndex = originalParent.columns.findIndex(col => col === column);
            if (columnIndex !== -1) {
                originalParent.columns.splice(columnIndex, 1);
            }
        }

        // Create new group hierarchy
        let newGroupStructure: GroupColumn<TOriginalRow> | null = null;
        let currentGroup: GroupColumn<TOriginalRow> | null = null;

        groupHierarchy.forEach((originalGroup, index) => {
            const newGroup: GroupColumn<TOriginalRow> = {
                ...originalGroup,
                columns: [],
                parentColumnId: index === 0 ? null : currentGroup?.columnId ?? null
            };

            if (index === 0) {
                newGroupStructure = newGroup;
            } else if (currentGroup) {
                currentGroup.columns = [newGroup];
            }

            currentGroup = newGroup;
        });

        // Add the target column to the deepest group
        if (currentGroup) {
            currentGroup.columns = [column];
            
            // Add the new structure at the appropriate position
            if (newGroupStructure) {
                if (insertionIndex !== -1) {
                    this.datagrid.columns.splice(insertionIndex, 0, newGroupStructure);
                } else {
                    const lastGroupedColumnIndex = this.findLastGroupedColumnIndex();
                    this.datagrid.columns.splice(lastGroupedColumnIndex + 1, 0, newGroupStructure);
                }
            }
        }

        // Clean up empty original groups
        this.cleanUpEmptyGroups();
        
        // Refresh the layout
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    private findLastGroupedColumnIndex(): number {
        const groupedColumnIds = new Set(this.datagrid.grouping.groupByColumns);
        
        for (let i = this.datagrid.columns.length - 1; i >= 0; i--) {
            const column = this.datagrid.columns[i];
            if (groupedColumnIds.has(column.columnId)) {
                return i;
            }
        }
        
        return -1;
    }

    /**
     * Moves a column back to its original group or after grouped columns when ungrouped
     */
    moveToOriginalPosition(column: AnyColumn<TOriginalRow>): void {
        const columnIndex = this.datagrid.columns.findIndex(col => col === column);
        if (columnIndex === -1) return;

        const [columnToMove] = this.datagrid.columns.splice(columnIndex, 1);

        // If column was in a group, move it back to the group
        if (columnToMove.parentColumnId) {
            const parentGroup = this.datagrid.columnGrouping.findParentColumnGroup(columnToMove.parentColumnId);
            if (parentGroup) {
                parentGroup.columns.push(columnToMove);
            } else {
                // If group not found, place after grouped columns
                const lastGroupedColumnIndex = this.findLastGroupedColumnIndex();
                this.datagrid.columns.splice(lastGroupedColumnIndex + 1, 0, columnToMove);
            }
        } else {
            // If column wasn't in a group, place after grouped columns
            const lastGroupedColumnIndex = this.findLastGroupedColumnIndex();
            this.datagrid.columns.splice(lastGroupedColumnIndex + 1, 0, columnToMove);
        }

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    private cleanUpEmptyGroups(): void {
        const removeEmptyGroups = (columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] => {
            return columns.filter(column => {
                if ('columns' in column) {
                    const groupColumn = column as GroupColumn<TOriginalRow>;
                    groupColumn.columns = removeEmptyGroups(groupColumn.columns);
                    return groupColumn.columns.length > 0;
                }
                return true;
            });
        };

        this.datagrid.columns = removeEmptyGroups(this.datagrid.columns);
    }

    private findGroupIndexInRoot(groupColumn: GroupColumn<TOriginalRow>): number {
        return this.datagrid.columns.findIndex(col => col === groupColumn);
    }

    private removeEmptyGroupFromRoot(groupColumn: GroupColumn<TOriginalRow>): void {
        const index = this.findGroupIndexInRoot(groupColumn);
        if (index !== -1) {
            this.datagrid.columns.splice(index, 1);
        }
    }

    // Helper method to recursively check if a group is empty
    private isGroupEmpty(group: GroupColumn<TOriginalRow>): boolean {
        if (!group.columns.length) return true;
        
        // Check if all subgroups are empty
        return group.columns.every(col => {
            if ('columns' in col) {
                return this.isGroupEmpty(col as GroupColumn<TOriginalRow>);
            }
            return false;
        });
    }

    moveLeftWithinGroup(column: AnyColumn<TOriginalRow>): void {
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

    moveRightWithinGroup(column: AnyColumn<TOriginalRow>): void {
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

    moveToGroup(column: AnyColumn<TOriginalRow>, targetGroupColumnId: string): void {
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