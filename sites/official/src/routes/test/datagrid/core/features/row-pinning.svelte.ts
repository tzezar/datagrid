import { SvelteSet } from "svelte/reactivity";
import type { Datagrid } from "../index.svelte";
import type { GridGroupRow, GridRow } from "../types";

export class RowPinning<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    rowIdsPinnedTop: SvelteSet<string> = new SvelteSet([]);
    rowIdsPinnedBottom: SvelteSet<string> = new SvelteSet([]);


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

        this.datagrid.flattenedRowsCache.forEach(row => {
            const id = 'groupId' in row ? row.index : row.index;
            if (this.rowIdsPinnedTop.has(id)) {
                pinnedTop.push(row);
            } else if (this.rowIdsPinnedBottom.has(id)) {
                pinnedBottom.push(row);
            } else {
                unpinned.push(row);
            }
        });

        this.topRowsCache = pinnedTop;
        // this.centerRowsCache = unpinned;
        this.bottomRowsCache = pinnedBottom;
    }

    // Get rows pinned to the top
    getTopRows(): GridRow<TOriginalRow>[] {
        return this.topRowsCache;
    }

    // Get unpinned rows (center)
    getCenterRows(): GridRow<TOriginalRow>[] {
        return this.datagrid.paginatedRowsCache.filter(row => !this.isPinnedToTop(row.index) && !this.isPinnedToBottom(row.index));
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
    

    // Pin a row or group to the top
    pinToTop(rowId: string) {
        let row = this.findRow(rowId);
        if (!row) return;

        if (this.isGroupRow(row)) {
            row = row as GridGroupRow<TOriginalRow>;
            // Pin the group itself
            this.rowIdsPinnedTop.add(row.index);
            // Pin all descendants
            const descendantIndices = this.getAllDescendantIndices(row);
            descendantIndices.forEach(id => this.rowIdsPinnedTop.add(id));
        } else {
            this.rowIdsPinnedTop.add(rowId);
        }

        // Remove from bottom pins if necessary
        this.rowIdsPinnedBottom.delete(rowId);
        this.datagrid.executeFullDataTransformation();
    }

    // Pin a row or group to the bottom
    pinToBottom(rowId: string) {
        const row = this.findRow(rowId);
        if (!row) return;

        if (this.isGroupRow(row)) {
            // Pin the group itself
            this.rowIdsPinnedBottom.add(row.index);
            // Pin all descendants
            const descendantIds = this.getAllDescendantIndices(row);
            descendantIds.forEach(id => this.rowIdsPinnedBottom.add(id));
        } else {
            this.rowIdsPinnedBottom.add(rowId);
        }

        // Remove from top pins if necessary
        this.rowIdsPinnedTop.delete(rowId);
        this.datagrid.executeFullDataTransformation();
    }

    // Helper to find a row by ID in the processed rows
    private findRow(rowId: string): GridRow<TOriginalRow> | undefined {
        const findInRows = (rows: GridRow<TOriginalRow>[]): GridRow<TOriginalRow> | undefined => {
            for (const row of rows) {
                if (this.isGroupRow(row)) {
                    if (row.index === rowId) return row;
                    const found = findInRows(row.children);
                    if (found) return found;
                } else {
                    if (row.index === rowId) return row;
                }
            }
            return undefined;
        };

        return findInRows(this.datagrid.getAllFlattenedRows(this.datagrid.groupedRowsCache));
    }

    // Unpin a row or group
    unpin(rowId: string) {
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

        this.datagrid.executeFullDataTransformation();
    }

    // Check if a row is pinned to top
    isPinnedToTop(rowId: string): boolean {
        return this.rowIdsPinnedTop.has(rowId);
    }

    // Check if a row is pinned to bottom
    isPinnedToBottom(rowId: string): boolean {
        return this.rowIdsPinnedBottom.has(rowId);
    }

    // Get pinning state of a row
    getPinningState(rowId: string): 'top' | 'bottom' | false {
        if (this.isPinnedToTop(rowId)) return 'top';
        if (this.isPinnedToBottom(rowId)) return 'bottom';
        return false;
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

    // Clear all pinned rows
    clearPinnedRows() {
        this.rowIdsPinnedTop.clear();
        this.rowIdsPinnedBottom.clear();
        this.datagrid.executeFullDataTransformation();
    }

    // Get all pinned row IDs
    getPinnedRowIds() {
        return {
            top: Array.from(this.rowIdsPinnedTop),
            bottom: Array.from(this.rowIdsPinnedBottom)
        };
    }

    getRowsPinnedToTop(): GridRow<TOriginalRow>[] {
        return this.datagrid.paginatedRowsCache.filter(row => this.isPinnedToTop(row.index));
    }
    getRowsPinnedToBottom(): GridRow<TOriginalRow>[] {
        return this.datagrid.paginatedRowsCache.filter(row => this.isPinnedToBottom(row.index));
    }

}