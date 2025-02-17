import type { CreateGroupParams } from "../features/column-grouping.svelte";
import type { ColumnId, GroupColumn, LeafColumn, PinningPosition } from "../types";
import { findColumnById, flattenColumnStructurePreservingGroups } from "../utils.svelte";
import { BaseService } from "./base-service";

export class ColumnControlService extends BaseService {

    updateColumnSize(columnId: ColumnId, width: number) {
        this.datagrid.features.columnSizing.updateColumnSize(columnId, width);
        this.datagrid.processors.column.refreshColumnPinningOffsets();

    }

    toggleColumnVisibility(columnId: ColumnId) {
        this.datagrid.features.columnVisibility.toggleColumnVisibility(columnId);
    }

    createGroup({ newGroupName, selectedColumns }: CreateGroupParams) {
        this.datagrid.features.columnGrouping.createGroup({ newGroupName, selectedColumns });
    }
    deleteGroupColumn(groupColumn: GroupColumn<any>) {
        this.datagrid.features.columnGrouping.deleteGroupColumn(groupColumn);
    }

    pinColumn(columnId: string, position: PinningPosition) {
        const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid._columns), columnId) as LeafColumn<any>;
        if (!column) throw new Error('Column not found');
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position)
        this.datagrid.processors.column.refreshColumnPinningOffsets();

    }

    changeColumnPinningPosition(columnId: string, position: PinningPosition) {
        const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid._columns), columnId) as LeafColumn<any>;
        if (!column) throw new Error('Column not found');
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }


    moveLeft(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.move(columnId, 'left');
    }
    moveRight(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.move(columnId, 'right')
    }
    moveColumnToPosition({ columnId, targetGroupColumnId }: { columnId: ColumnId, targetGroupColumnId: string }) {
        this.datagrid.features.columnOrdering.moveToPosition(columnId, targetGroupColumnId);
    }

}