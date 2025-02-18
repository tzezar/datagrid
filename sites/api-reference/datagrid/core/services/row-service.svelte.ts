import type { GridBasicRow, GridGroupRow, GridRowIdentifier } from "../types";
import { BaseService } from "./base-service";

/**
 * Interface for row operations in the data grid, including selection, pinning, and expansion.
 */
export type RowOperations = {
    // Row selection
    /**
     * Selects all rows on the current page.
     */
    selectRowsOnCurrentPage: () => void;

    /**
     * Deselects all rows on the current page.
     */
    deselectRowsOnCurrentPage: () => void;

    /**
     * Selects all rows in the data grid.
     */
    selectAllRows: () => void;

    /**
     * Deselects all rows in the data grid.
     */
    deselectAllRows: () => void;

    /**
     * Toggles the selection of a row by its identifier.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to toggle selection for.
     */
    toggleRowSelection: (rowIdentifier: GridRowIdentifier) => void;

    // Row pinning
    /**
     * Pins a row to the top of the data grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to pin.
     */
    pinRowToTop: (rowIdentifier: GridRowIdentifier) => void;

    /**
     * Pins a row to the bottom of the data grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to pin.
     */
    pinRowToBottom: (rowIdentifier: GridRowIdentifier) => void;

    /**
     * Unpins a row from the grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to unpin.
     */
    unpinRow: (rowIdentifier: GridRowIdentifier) => void;

    /**
     * Toggles the expansion state of a row.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to toggle expansion for.
     */
    toggleRowExpansion: (rowIdentifier: GridRowIdentifier) => void;

    /**
     * Toggles the expansion state of a group of rows.
     * 
     * @param {GridGroupRow<any>} row The group row to toggle expansion for.
     */
    toggleGroupExpansion: <TOriginalRow>(row: GridGroupRow<TOriginalRow>) => void;
}

/**
 * Service for handling row-related operations in a data grid, such as row selection, pinning, and expansion.
 * 
 * @extends BaseService
 */
export class RowService extends BaseService implements RowOperations {

    /**
     * Selects all rows on the current page.
     */
    selectRowsOnCurrentPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }

    /**
     * Deselects all rows on the current page.
     */
    deselectRowsOnCurrentPage() {
        const rowsOnPage = (this.datagrid.cacheManager.paginatedRows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rowsOnPage.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }

    /**
     * Selects all rows in the data grid.
     */
    selectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.selectRows(ids);
    }

    /**
     * Deselects all rows in the data grid.
     */
    deselectAllRows() {
        const rows = (this.datagrid.cacheManager.rows || []).filter(row => !row.isGroupRow()) as GridBasicRow<any>[];
        const ids = rows.map(row => row.identifier);
        this.datagrid.features.rowSelection.unselectRows(ids);
    }

    /**
     * Toggles the selection state of a row by its identifier.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to toggle selection for.
     */
    toggleRowSelection(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowSelection.toggleRowSelection(rowIdentifier);
    }

    /**
     * Pins a row to the top of the data grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to pin.
     */
    pinRowToTop(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.pinRow(rowIdentifier, 'top');
    }

    /**
     * Pins a row to the bottom of the data grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to pin.
     */
    pinRowToBottom(rowIdentifier: GridRowIdentifier) {
        this.datagrid.features.rowPinning.pinRow(rowIdentifier, 'bottom');
    }

    /**
     * Unpins a row from the data grid.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to unpin.
     */
    unpinRow(rowIdentifier: GridRowIdentifier) {
        this.datagrid.events.emit('onRowUnpin', { rowIdentifier });
        this.datagrid.features.rowPinning.unpinRow(rowIdentifier);
    }

    /**
     * Toggles the expansion state of a row.
     * 
     * @param {GridRowIdentifier} rowIdentifier The identifier of the row to toggle expansion for.
     */
    toggleRowExpansion(rowIdentifier: GridRowIdentifier) {
        if (this.datagrid.features.rowExpanding.isRowExpanded(rowIdentifier)) {
            this.datagrid.features.rowExpanding.collapseRow(rowIdentifier);
            return;
        }

        const maxExpandedRows = this.datagrid.features.rowExpanding.maxExpandedRows;
        const isExceedingLimit = this.datagrid.features.rowExpanding.expandedRowIds.size >= maxExpandedRows;

        if (isExceedingLimit) {
            return;
        }

        this.datagrid.features.rowExpanding.expandedRowIds.add(rowIdentifier);
    }

    /**
     * Toggles the expansion state of a group row.
     * 
     * @param {GridGroupRow<any>} row The group row to toggle expansion for.
     */
    toggleGroupExpansion<TOriginalRow>(row: GridGroupRow<TOriginalRow>) {
        if (row.isExpanded()) {
            this.datagrid.features.grouping.collapseGroup(row.identifier);
        } else {
            this.datagrid.features.grouping.expandGroup(row.identifier);
        }

        // Invalidate the flattened view cache
        this.datagrid.cacheManager.invalidateGroupedRowsCache();

        // Use the new optimized method instead of full transformation
        this.datagrid.processors.data.handleGroupExpansion();
    }
}
