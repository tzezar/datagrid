import { type ColumnGroup } from "../types";
import type { DatagridCore } from "../index.svelte";
import { findColumnById, flattenColumnStructurePreservingGroups, generateRandomColumnId } from "../utils.svelte";
import { createColumnGroup } from "../column-creation/column-group-creator";
import type { MoveOperation } from "./column-ordering.svelte";

/**
 * State representation for the Column Grouping feature in the datagrid.
 * Currently, it doesn't hold any specific state, but can be expanded in the future.
 */
export type ColumnGroupingFeatureState = object;

/**
 * Configuration options for the Column Grouping feature.
 * Partial configuration for flexibility.
 */
export type ColumnGroupingFeatureConfig = Partial<ColumnGroupingFeatureState>;

/**
 * Interface for the Column Grouping feature.
 */
export type IColumnGroupingFeature = ColumnGroupingFeatureState;

/**
 * Parameters for creating a new column group.
 */
export interface CreateGroupParams {
    /** The name of the new group to be created. */
    newGroupName: string;
    /** A map of column IDs and their selection status to include in the group. */
    selectedColumns: Record<string, boolean>;
}

/**
 * Plugin configuration for the Column Grouping feature.
 */
export type ColumnGroupingPluginConfig = object;

/**
 * ColumnGroupingFeature class handles the creation, deletion, and management of column groups in the datagrid.
 * It allows grouping columns, moving columns into groups, and emitting events related to column group creation and deletion.
 */
export class ColumnGroupingFeature<TOriginalRow = any> implements IColumnGroupingFeature {
    private datagrid: DatagridCore<TOriginalRow>;

    /**
     * Constructs the ColumnGroupingFeature instance.
     * @param datagrid - The datagrid instance that this feature will operate on.
     * @param config - Configuration options for the column grouping feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnGroupingPluginConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Deletes a column group from the datagrid.
     * This method removes the group column and moves its child columns back to the root level or their parent group.
     * It also triggers a refresh of the column pinning offsets after the deletion.
     * 
     * @param columnGroup - The column group to be deleted.
     */
    deleteGroupColumn(columnGroup: ColumnGroup<TOriginalRow>): void {
        this.datagrid.events.emit('onColumnGroupDeletion', { columnGroup });
        const childColumns = [...columnGroup.columns];

        if (columnGroup.parentColumnId === null) {
            // Group is at root level
            const groupIndex = this.datagrid._columns.findIndex(col => col === columnGroup);
            if (groupIndex !== -1) {
                this.datagrid._columns.splice(groupIndex, 1);
                childColumns.forEach(childColumn => {
                    childColumn.parentColumnId = null;
                    this.datagrid._columns.splice(groupIndex, 0, childColumn);
                });
            }
        } else {
            // Group is nested within another group
            const parentGroup = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid._columns), columnGroup.parentColumnId) as ColumnGroup<TOriginalRow>;

            if (!parentGroup) throw new Error('Parent group not found');

            const groupIndex = parentGroup.columns.findIndex(col => col === columnGroup);
            if (groupIndex !== -1) {
                parentGroup.columns.splice(groupIndex, 1);
                childColumns.forEach(childColumn => {
                    childColumn.parentColumnId = String(parentGroup.columnId);
                    parentGroup.columns.splice(groupIndex, 0, childColumn);
                });
            }
        }

        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Creates a new column group and adds selected columns into it.
     * This method generates a new column group, moves the selected columns into it, 
     * and triggers a refresh of the column state.
     * 
     * @param {CreateGroupParams} params - The parameters for creating the new column group, including the group name and selected columns.
     */
    createGroup({ newGroupName, selectedColumns }: CreateGroupParams): void {
        // Create the new group column
        const columnGroup = createColumnGroup({
            header: newGroupName,
            columnId: generateRandomColumnId(),
            parentColumnId: null,
            columns: []
        });

        // Add the group to the root level
        this.datagrid._columns.push(columnGroup);

        // Get the column IDs to be grouped
        const columnIdsToBeGrouped = Object.entries(selectedColumns)
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

        // Refresh the column state after the changes
        this.datagrid.features.columnOrdering.refreshColumnState();

        // Emit event for column group creation
        this.datagrid.events.emit('onColumnGroupCreation', { columnGroup });
    }
}
