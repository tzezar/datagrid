import { SvelteSet } from "svelte/reactivity";
import type { DataGrid } from "../index.svelte";
import type { GridGroupRow, GridRow, GridRowIdentifier, RowPinningPosition } from "../types";
import { isGroupRow } from "../utils.svelte";

export class RowPinningFeature<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    rowIdsPinnedTop: SvelteSet<GridRowIdentifier> = new SvelteSet([]);
    rowIdsPinnedBottom: SvelteSet<GridRowIdentifier> = new SvelteSet([]);

    // Cache for pinned rows
    private topRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    private bottomRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);


    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // Update the caches based on current processedRowsCache
    updatePinnedRows() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];



        for (let i = 0; i < this.datagrid.cacheManager.rows.length; i++) {
            const row = this.datagrid.cacheManager.rows[i];
            const rowIdentifier = this.datagrid.rowManager.getRowIdentifier(row);
            if (this.rowIdsPinnedTop.has(rowIdentifier)) {
                pinnedTop.push(row);
            } else if (this.rowIdsPinnedBottom.has(rowIdentifier)) {
                pinnedBottom.push(row);
            } else {
                unpinned.push(row);
            }
        }

        this.topRowsCache = pinnedTop;
        this.bottomRowsCache = pinnedBottom;
    }

    updatePinnedRowsInOrder() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];

        for (const rowIndex of this.rowIdsPinnedTop) {
            const row = this.datagrid.rowManager.findRowByIdentifier(rowIndex);
            if (row) pinnedTop.push(row);
        }

        // Iterate through all pinned bottom rows
        for (const rowIndex of this.rowIdsPinnedBottom) {
            const row = this.datagrid.rowManager.findRowByIdentifier(rowIndex);
            if (row) pinnedBottom.push(row);
        }

        // Iterate through all rows to populate unpinned array
        this.datagrid.cacheManager.rows.forEach(row => {
            const id = this.datagrid.rowManager.getRowIdentifier(row);
            if (!this.rowIdsPinnedTop.has(id) && !this.rowIdsPinnedBottom.has(id)) {
                unpinned.push(row);
            }
        });
    }

    // ? Apply row pinning to the processed rows while maintaining group structure
    // ? This might be usefull later for virtualized datagrid that requires to pass data as one big array instead splitted into top, bottom, center rows
    getRowsAsArrayInPinnedOrder(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];

        const processRow = (row: GridRow<TOriginalRow>) => {
            const rowId = this.datagrid.rowManager.getRowIdentifier(row);
            const pinningState = this.getPinningState(rowId);

            if (isGroupRow(row)) {
                // Create a new group row with processed children
                const processedRow: GridGroupRow<TOriginalRow> = {
                    ...row,
                    children: [...row.children] // Create a new array for children
                };
                if (pinningState === 'top') {
                    pinnedTop.push(processedRow);
                } else if (pinningState === 'bottom') {
                    pinnedBottom.push(processedRow);
                } else {
                    unpinned.push(processedRow);
                }
            } else {
                if (pinningState === 'top') {
                    pinnedTop.push(row);
                } else if (pinningState === 'bottom') {
                    pinnedBottom.push(row);
                } else {
                    unpinned.push(row);
                }
            }
        };

        rows.forEach(processRow);

        return [...pinnedTop, ...unpinned, ...pinnedBottom];
    }


    /**
     * Get rows pinned to the top
     */
    getTopRows(): GridRow<TOriginalRow>[] {
        return this.topRowsCache;
    }

    /**
     * Get unpinned rows (center)
     */
    getCenterRows(): GridRow<TOriginalRow>[] {
        return (this.datagrid.cacheManager.paginatedRows || []).filter(row => {
            const id = this.datagrid.rowManager.getRowIdentifier(row);
            return !this.isPinnedTop(id) && !this.isPinnedBottom(id);
        });
    }

    /**
     * Get rows pinned to the bottom
     */
    getBottomRows(): GridRow<TOriginalRow>[] {
        return this.bottomRowsCache;
    }

    // Pin a row or group to the top
    pinRowTop(rowIdentifier: GridRowIdentifier) {
        let row = this.datagrid.rowManager.findRowByIdentifier(rowIdentifier);
        if (!row) return;

        if (isGroupRow(row)) {
            row = row as GridGroupRow<TOriginalRow>;
            // Pin the group itself
            this.rowIdsPinnedTop.add(row.identifier);
            // Pin all descendants
            const descendantIndices = this.datagrid.rowManager.getAllDescendantIndifiers(row);
            descendantIndices.forEach(id => this.rowIdsPinnedTop.add(id));
        } else {
            if (this.isPinnedTop(rowIdentifier)) this.rowIdsPinnedTop.delete(rowIdentifier);
            else this.rowIdsPinnedTop.add(rowIdentifier);
            
        }
        
        // Remove from bottom pins if necessary
        this.rowIdsPinnedBottom.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Pin a row or group to the bottom
    pinRowBottom(rowIdentifier: GridRowIdentifier) {
        const row = this.datagrid.rowManager.findRowByIdentifier(rowIdentifier);
        if (!row) return;

        if (isGroupRow(row)) {
            // Pin the group itself
            this.rowIdsPinnedBottom.add(row.identifier);
            // Pin all descendants
            const descendantIds = this.datagrid.rowManager.getAllDescendantIndifiers(row);
            descendantIds.forEach(id => this.rowIdsPinnedBottom.add(id));
        } else {
            if (this.isPinnedBottom(rowIdentifier)) this.rowIdsPinnedBottom.delete(rowIdentifier);
            else this.rowIdsPinnedBottom.add(rowIdentifier);
        }

        // Remove from top pins if necessary
        this.rowIdsPinnedTop.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Unpin a row or group
    unpinRow(rowId: GridRowIdentifier) {
        const row = this.datagrid.rowManager.findRowByIdentifier(rowId);
        if (!row) return;

        if (isGroupRow(row)) {
            // Unpin the group itself
            this.rowIdsPinnedTop.delete(row.identifier);
            this.rowIdsPinnedBottom.delete(row.identifier);
            // Unpin all descendants
            const descendantIds = this.datagrid.rowManager.getAllDescendantIndifiers(row);
            descendantIds.forEach(id => {
                this.rowIdsPinnedTop.delete(id);
                this.rowIdsPinnedBottom.delete(id);
            });
        } else {
            this.rowIdsPinnedTop.delete(rowId);
            this.rowIdsPinnedBottom.delete(rowId);
        }

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    isPinnedTop(rowId: GridRowIdentifier): boolean {
        return this.rowIdsPinnedTop.has(rowId);
    }

    isPinnedBottom(rowId: GridRowIdentifier): boolean {
        return this.rowIdsPinnedBottom.has(rowId);
    }

    isPinned(rowId: GridRowIdentifier): boolean {
        return this.isPinnedTop(rowId) || this.isPinnedBottom(rowId);
    }

    /**
     * Get the pinning state of a row.
     *
     * @param rowId - The unique identifier of the row.
     * @returns The pinning state of the row:
     * - `'top'` if the row is pinned to the top.
     * - `'bottom'` if the row is pinned to the bottom.
     * - `false` if the row is not pinned.
     */
    getPinningState(rowId: GridRowIdentifier): RowPinningPosition {
        if (this.isPinnedTop(rowId)) return 'top';
        if (this.isPinnedBottom(rowId)) return 'bottom';
        return false;
    }

    // Clear all pinned rows
    clearPinnedRows() {
        this.rowIdsPinnedTop.clear();
        this.rowIdsPinnedBottom.clear();
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Get all pinned row IDs
    getIdentifiersOfPinnedRows() {
        return {
            top: Array.from(this.rowIdsPinnedTop),
            bottom: Array.from(this.rowIdsPinnedBottom)
        };
    }

}