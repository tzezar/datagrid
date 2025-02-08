import type { GridBasicRow, GridGroupRow, GridRowIdentifier } from "../types";
import { BaseService } from "./base-service";


export type RowOperations = {
    // Row selection
    selectRowsOnCurrentPage: () => void;
    deselectRowsOnCurrentPage: () => void;
    selectAllRows: () => void;
    deselectAllRows: () => void;
    toggleRowSelection: (rowIdentifier: GridRowIdentifier) => void;
    
    // Row pinning
    pinRowToTop: (rowIdentifier: GridRowIdentifier) => void;
    pinRowToBottom: (rowIdentifier: GridRowIdentifier) => void;
    unpinRow: (rowIdentifier: GridRowIdentifier) => void;
    
    toggleRowExpansion: (rowIdentifier: GridRowIdentifier) => void;
    toggleGroupRowExpansion: (row: GridGroupRow<any>) => void

}

export class RowService extends BaseService implements RowOperations {
    selectRowsOnCurrentPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }
    deselectRowsOnCurrentPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }
    selectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }
    deselectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }
    toggleRowSelection(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowSelection.toggleRowSelection(rowIdentifier);
    }


    pinRowToTop(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.pinRowTop(rowIdentifier);
    }
    pinRowToBottom(rowIdentifier: GridRowIdentifier) {
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