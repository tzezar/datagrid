import type { CreateGroupParams } from "../features/column-grouping.svelte";
import type { ColumnId, GroupColumn, PinningPosition } from "../types";
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
        const column = this.datagrid.columns.findColumnById(columnId);
        if (!column) return;
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
        this.datagrid.processors.column.refreshColumnPinningOffsets();

    }

    changeColumnPinningPosition(columnId: string, position: PinningPosition) {
        const column = this.datagrid.columns.findColumnById(columnId);
        if (!column) throw new Error(`Column ${columnId} not found`);
        this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
        this.datagrid.processors.column.refreshColumnPinningOffsets();
    }


    moveLeft(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.moveLeft(columnId);
    }
    moveRight(columnId: ColumnId) {
        this.datagrid.features.columnOrdering.moveRight(columnId)
    }
    moveColumnToPosition({ columnId, targetGroupColumnId }: { columnId: ColumnId, targetGroupColumnId: string }) {
        this.datagrid.features.columnOrdering.moveColumnToPosition(columnId, targetGroupColumnId);
    }
    
}