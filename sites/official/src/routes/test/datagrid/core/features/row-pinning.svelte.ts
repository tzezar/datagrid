import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";
import type { GridGroupRow, GridRow, RowIdentifier as RowId, RowPinningPosition } from "../types";

export class RowPinningFeature<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    rowIdsPinnedTop: SvelteSet<RowId> = new SvelteSet([]);
    rowIdsPinnedBottom: SvelteSet<RowId> = new SvelteSet([]);


    // Cache for pinned rows
    private topRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    private bottomRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);


    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // Update the caches based on current processedRowsCache
    updatePinnedRows() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];



        for (let i = 0; i < this.datagrid.cache.rows.length; i++) {
            const row = this.datagrid.cache.rows[i];
            const id = this.datagrid.rowManager.getRowId(row);
            if (this.rowIdsPinnedTop.has(id)) {
                pinnedTop.push(row);
            } else if (this.rowIdsPinnedBottom.has(id)) {
                pinnedBottom.push(row);
            } else {
                unpinned.push(row);
            }
        }

        this.topRowsCache = pinnedTop;
        // this.centerRowsCache = unpinned;
        this.bottomRowsCache = pinnedBottom;

        // ? this one preserve the order
        // // Iterate through all pinned top rows
        // for (const rowIndex of this.rowIdsPinnedTop) {
        //     const row = this.findRow(rowIndex);
        //     if (row) pinnedTop.push(row);
        // }

        // // Iterate through all pinned bottom rows
        // for (const rowIndex of this.rowIdsPinnedBottom) {
        //     const row = this.findRow(rowIndex);
        //     if (row) pinnedBottom.push(row);
        // }

        // // Iterate through all rows to populate unpinned array
        // this.datagrid.cache.rows.forEach(row => {
        //     const id = this.isGroupRow(row) ? row.groupId : row.index;
        //     if (!this.rowIdsPinnedTop.has(id) && !this.rowIdsPinnedBottom.has(id)) {
        //         unpinned.push(row);
        //     }
        // });
    }

    // Apply row pinning to the processed rows while maintaining group structure
    applyRowPinning(rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];

        const processRow = (row: GridRow<TOriginalRow>) => {
            const rowId = this.isGroupRow(row) ? row.groupId : row.index;
            const pinningState = this.getPinningState(rowId);

            if (this.isGroupRow(row)) {
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


    // Get rows pinned to the top
    getTopRows(): GridRow<TOriginalRow>[] {
        return this.topRowsCache;
    }

    // Get unpinned rows (center)
    getCenterRows(): GridRow<TOriginalRow>[] {
        return this.datagrid.cache.paginatedRowsCache.filter(row => {
            const id = this.datagrid.rowManager.getRowId(row);
            return !this.isPinnedToTop(id) && !this.isPinnedToBottom(id);
        });
    }

    // Get rows pinned to the bottom
    getBottomRows(): GridRow<TOriginalRow>[] {
        return this.bottomRowsCache;
    }



    // Helper to check if a row is a group row
    private isGroupRow(row: GridRow<TOriginalRow>): row is GridGroupRow<TOriginalRow> {
        return 'groupId' in row;
    }

    // Helper to get all descendant row IDs of a group
    private getAllDescendantIndices(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (this.isGroupRow(child)) {
                ids.push(child.groupId);
                ids.push(...this.getAllDescendantIndices(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }


    pinRow(rowIdentifier: RowId, position: RowPinningPosition) {
        if (position === 'top') {
            this.pinToTop(rowIdentifier);
        } else if (position === 'bottom') {
            this.pinToBottom(rowIdentifier);
        } else {
            this.unpin(rowIdentifier);
        }
    }


    // Pin a row or group to the top
    pinToTop(rowIdentifier: RowId) {

        let row = this.datagrid.rowManager.findRowById(rowIdentifier);
        console.log(row)

        if (!row) return;

        if (this.isGroupRow(row)) {
            row = row as GridGroupRow<TOriginalRow>;
            // Pin the group itself
            this.rowIdsPinnedTop.add(row.index);
            // Pin all descendants
            const descendantIndices = this.getAllDescendantIndices(row);
            descendantIndices.forEach(id => this.rowIdsPinnedTop.add(id));
        } else {
            this.rowIdsPinnedTop.add(rowIdentifier);
        }

        // Remove from bottom pins if necessary
        this.rowIdsPinnedBottom.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Pin a row or group to the bottom
    pinToBottom(rowIndex: RowId) {
        const row = this.datagrid.rowManager.findRowById(rowIndex);
        if (!row) return;

        if (this.isGroupRow(row)) {
            // Pin the group itself
            this.rowIdsPinnedBottom.add(row.index);
            // Pin all descendants
            const descendantIds = this.getAllDescendantIndices(row);
            descendantIds.forEach(id => this.rowIdsPinnedBottom.add(id));
        } else {
            this.rowIdsPinnedBottom.add(rowIndex);
        }

        // Remove from top pins if necessary
        this.rowIdsPinnedTop.delete(rowIndex);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Helper to find a row by ID in the processed rows
    private findRow(rowIdentifier: RowId): GridRow<TOriginalRow> | undefined {
        const findInRows = (rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow> | undefined => {
            for (const row of rows) {
                if (this.isGroupRow(row)) {
                    if (row.index === rowIdentifier) return row;
                    const found = findInRows(row.children);
                    if (found) return found;
                } else {
                    if (row.index === rowIdentifier) return row;
                }
            }
            return undefined;
        };

        if (this.datagrid.grouping.groupByColumns.length === 0) return findInRows(this.datagrid.cache.rows || []);
        return findInRows(this.datagrid.rowManager.flattenGridRows(this.datagrid.cache.groupedRowsCache || []));
    }

    // Unpin a row or group
    unpin(rowId: RowId) {
        const row = this.findRow(rowId);
        if (!row) return;

        if (this.isGroupRow(row)) {
            // Unpin the group itself
            this.rowIdsPinnedTop.delete(row.groupId);
            this.rowIdsPinnedBottom.delete(row.groupId);
            // Unpin all descendants
            const descendantIds = this.getAllDescendantIndices(row);
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

    // Check if a row is pinned to top
    isPinnedToTop(rowId: RowId): boolean {
        return this.rowIdsPinnedTop.has(rowId);
    }

    // Check if a row is pinned to bottom
    isPinnedToBottom(rowId: RowId): boolean {
        return this.rowIdsPinnedBottom.has(rowId);
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
    getPinningState(rowId: string): RowPinningPosition {
        if (this.isPinnedToTop(rowId)) return 'top';
        if (this.isPinnedToBottom(rowId)) return 'bottom';
        return false;
    }

    // Clear all pinned rows
    clearPinnedRows() {
        this.rowIdsPinnedTop.clear();
        this.rowIdsPinnedBottom.clear();
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Get all pinned row IDs
    getPinnedRowIds() {
        return {
            top: Array.from(this.rowIdsPinnedTop),
            bottom: Array.from(this.rowIdsPinnedBottom)
        };
    }

    // getRowsPinnedToTop(): GridRow<TOriginalRow>[] {
    //     return this.datagrid.cache.paginatedRowsCache.filter(row => this.isPinnedToTop(row.index));
    // }
    // getRowsPinnedToBottom(): GridRow<TOriginalRow>[] {
    //     return this.datagrid.cache.paginatedRowsCache.filter(row => this.isPinnedToBottom(row.index));
    // }

}