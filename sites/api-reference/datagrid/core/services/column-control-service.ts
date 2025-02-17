import type { CreateGroupParams } from "../features/column-grouping.svelte";
import type { ColumnId, ColumnGroup, LeafColumn, PinningPosition } from "../types";
import { findColumnById, flattenColumnStructurePreservingGroups } from "../utils.svelte";
import { BaseService } from "./base-service";

/**
 * Service for managing column operations in the datagrid, including column resizing, visibility, pinning, ordering, and grouping.
 * 
 * @extends BaseService
 */
export class ColumnControlService extends BaseService {

    /**
     * Updates the size of a specified column.
     * 
     * @param {ColumnId} columnId The ID of the column to resize.
     * @param {number} width The new width for the column.
     */
    updateColumnSize(columnId: ColumnId, width: number) {
        this.datagrid.features.columnSizing.updateColumnSize(columnId, width);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Toggles the visibility of a specified column.
     * 
     * @param {ColumnId} columnId The ID of the column whose visibility will be toggled.
     */
    toggleColumnVisibility(columnId: ColumnId) {
        this.datagrid.features.columnVisibility.toggleColumnVisibility(columnId);
    }

    /**
     * Creates a new group of selected columns.
     * 
     * @param {CreateGroupParams} params The parameters for creating the group, including the group name and selected columns.
     */
    createGroup({ newGroupName, selectedColumns }: CreateGroupParams) {
        this.datagrid.features.columnGrouping.createGroup({ newGroupName, selectedColumns });
    }

    /**
     * Deletes a group column.
     * 
     * @param {ColumnGroup<any>} groupColumn The group column to delete.
     */
    deleteGroupColumn(groupColumn: ColumnGroup<any>) {
        this.datagrid.features.columnGrouping.deleteGroupColumn(groupColumn);
    }

    /**
     * Pins a specified column to a given position.
     * 
     * @param {string} columnId The ID of the column to pin.
     * @param {PinningPosition} position The pinning position (left, right, etc.).
     * @throws {Error} Throws an error if the column is not found.
     */
    pinColumn(columnId: string, position: PinningPosition) {
        const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid._columns), columnId) as LeafColumn<any>;
        if (!column) throw new Error('Column not found');
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Changes the pinning position of a specified column.
     * 
     * @param {string} columnId The ID of the column to change the pinning position.
     * @param {PinningPosition} position The new pinning position (left, right, etc.).
     * @throws {Error} Throws an error if the column is not found.
     */
    changeColumnPinningPosition(columnId: string, position: PinningPosition) {
        const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid._columns), columnId) as LeafColumn<any>;
        if (!column) throw new Error('Column not found');
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }

    /**
     * Moves a column to the left.
     * 
     * @param {ColumnId} columnId The ID of the column to move.
     */
    moveLeft(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.move(columnId, 'left');
    }

    /**
     * Moves a column to the right.
     * 
     * @param {ColumnId} columnId The ID of the column to move.
     */
    moveRight(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.move(columnId, 'right');
    }

    /**
     * Moves a column to a specific position relative to a target group column.
     * 
     * @param {Object} params The parameters for moving the column.
     * @param {ColumnId} params.columnId The ID of the column to move.
     * @param {string} params.targetGroupColumnId The ID of the target group column to move the column to.
     */
    moveColumnToPosition({ columnId, targetGroupColumnId }: { columnId: ColumnId, targetGroupColumnId: string }) {
        this.datagrid.features.columnOrdering.moveToPosition(columnId, targetGroupColumnId);
    }
}
