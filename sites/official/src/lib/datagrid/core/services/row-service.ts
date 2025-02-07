import type { GridBasicRow, GridGroupRow, GridRowIdentifier } from "../types";
import { BaseService } from "./base-service";

export class RowService extends BaseService {
    selectRowsOnPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }
    unselectRowsOnPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }
    selectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }
    unselectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }
    toggleRowSelection(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowSelection.toggleRowSelection(rowIdentifier);
    }


    pinRowTop(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.pinRowTop(rowIdentifier);
    }
    pinRowBottom(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.pinRowBottom(rowIdentifier);
    }
    unpinRow(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.unpinRow(rowIdentifier);
    }

    toggleRowExpansion(rowIdentifier: GridRowIdentifier) {
        if (this.datagrid.features.rowExpanding.isRowExpanded(rowIdentifier)) {
            this.datagrid.features.rowExpanding.toggleRowExpansion(rowIdentifier);
            return
        }

        const maxExpandedRows = this.datagrid.features.rowExpanding.maxExpandedRows;
        const isExpandingMoreThanMax = this.datagrid.features.rowExpanding.expandedRowIds.size >= maxExpandedRows;

        if (isExpandingMoreThanMax) {
            this.datagrid.features.rowExpanding.onExceedMaxExpansion(this.datagrid.features.rowExpanding)
            return
        }

        this.datagrid.features.rowExpanding.expandedRowIds.add(rowIdentifier);
    }

    toggleGroupRowExpansion<TOriginalRow>(row: GridGroupRow<TOriginalRow>) {
        if (row.isExpanded()) {
            this.datagrid.features.grouping.expandedGroups.delete(row.identifier);
        } else {
            this.datagrid.features.grouping.expandedGroups.add(row.identifier);
        }

        // Only invalidate the flattened view cache
        this.datagrid.cacheManager.invalidateGroupedRowsCache();

        // Use the new optimized method instead of full transformation
        this.datagrid.processors.data.handleGroupExpansion();
    }

}