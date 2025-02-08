
import { type GroupColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import { generateRandomColumnId } from "../utils.svelte";
import { createColumnGroup } from "../column-creation/group-column-creator";
import type { MoveOperation } from "./column-ordering.svelte";



export type ColumnGroupingFeatureState = object
export type ColumnGroupingFeatureConfig = Partial<ColumnGroupingFeatureState>
export type IColumnGroupingFeature = ColumnGroupingFeatureState


export interface CreateGroupParams {
    newGroupName: string;
    selectedColumns: Record<string, boolean>;
}

export type ColumnGroupingPluginConfig = object


/**
 * Manages column grouping functionality for a data grid, including finding,
 * renaming, and deleting group columns, as well as handling column nesting.
 */
export class ColumnGroupingFeature<TOriginalRow = any> implements IColumnGroupingFeature {
    // Reference to the parent DataGrid instance
    private datagrid: DatagridCore<TOriginalRow>;

    /**
     * Initializes the column grouping feature for the given data grid.
     * @param datagrid - The DataGrid instance this feature is associated with.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnGroupingPluginConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }


    /**
        * Deletes a group column and reassigns its children to the appropriate level.
        * @param columnGroup - The group column to delete.
        */
    deleteGroupColumn(columnGroup: GroupColumn<TOriginalRow>): void {
        this.datagrid.events.emit('onColumnGroupDeletion', { columnGroup });
        const childColumns = [...columnGroup.columns];

        if (columnGroup.parentColumnId === null) {
            // Group is at root level
            // Remove the group from root level columns
            const groupIndex = this.datagrid._columns.findIndex(col => col === columnGroup);
            if (groupIndex !== -1) {
                this.datagrid._columns.splice(groupIndex, 1);

                // Move all children to root level
                childColumns.forEach(childColumn => {
                    childColumn.parentColumnId = null;
                    this.datagrid._columns.splice(groupIndex, 0, childColumn);
                });
            }
        } else {
            // Group is nested within another group
            const parentGroup = this.datagrid.columns.findColumnById(columnGroup.parentColumnId) as GroupColumn<TOriginalRow>;
            if (!parentGroup) throw new Error('Parent group not found');
            if (parentGroup) {
                // Find and remove the group from its parent
                const groupIndex = parentGroup.columns.findIndex(col => col === columnGroup);
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

    createGroup({ newGroupName, selectedColumns }: CreateGroupParams) {
        // Create the new group column
        const columnGroup = createColumnGroup({
            header: newGroupName,
            columnId: generateRandomColumnId(),
            parentColumnId: null,
            columns: []
        })

        // Add the group directly to the root level
        this.datagrid._columns.push(columnGroup);

        // Get the column IDs that need to be grouped
        const columnIdsToBeGrouped = Object.entries(selectedColumns)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, selected]) => selected)
            .map(([columnId]) => columnId);

        // Move each selected column into the new group
        for (const columnId of columnIdsToBeGrouped) {
            const column = this.datagrid.features.columnOrdering.findColumnOrThrow(columnId);

            const moveOperation: MoveOperation = {
                sourceColumn: column,
                targetLocation: {
                    parentId: columnGroup.columnId,
                    index: columnGroup.columns.length
                }
            };

            this.datagrid.features.columnOrdering.validateMove(moveOperation);
            this.datagrid.features.columnOrdering.executeMove(moveOperation);
        }

        // Refresh the column state
        this.datagrid.features.columnOrdering.refreshColumnState();

        this.datagrid.events.emit('onColumnGroupCreation', { columnGroup });
    }


}