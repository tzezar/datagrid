import type { ColumnId, PinningPosition } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups, flattenColumnStructurePreservingGroups } from "../utils.svelte";
import { BaseService } from "./base-service";

export class PaginationService extends BaseService {
    goToPrevPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToPrevPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        })
    }
    goToNextPage() {
        this.datagrid.refresh(() => this.datagrid.features.pagination.goToNextPage(), {
            recalculateAll: false,
            recalculateGroups: false,
            recalculatePagination: true
        })
    }
    changePageSize(newPageSize: number) {
        this.datagrid.refresh(() => this.datagrid.features.pagination.setPageSize(newPageSize), {
            recalculatePagination: true
        });
    }
    goToPage(newPage: number) {
        this.datagrid.refresh(() => {
            this.datagrid.features.pagination.page = Math.min(
                Math.max(newPage, 1),
                this.datagrid.features.pagination.pageCount
            );
        });
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

        pinColumn(columnId: string, position: PinningPosition) {
            const column = findColumnById(flattenColumnStructurePreservingGroups(this.datagrid.columns), columnId);
            if (!column) return;
            this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
    
        }
        changeColumnPinningPosition(columnId: string, position: PinningPosition) {
            const column = findColumnById(flattenColumnStructureAndClearGroups(this.datagrid.columns), columnId);
            if (!column) throw new Error(`Column ${columnId} not found`);
            this.datagrid.features.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
        }
}