import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridGroupRow, GridRow, GridRowIdentifier, RowPinningPosition } from "../types";
import { getGroupRowChildrenIds } from "../utils.svelte";


export type RowPinningFeatureState = {
    pinnedTopRowIds: SvelteSet<GridRowIdentifier>;
    pinnedBottomRowIds: SvelteSet<GridRowIdentifier>;
}

export type RowPinningFeatureConfig = Partial<RowPinningFeatureState>

export type IRowPinningFeature = {} & RowPinningFeatureState

export class RowPinningFeature<TOriginalRow = any> implements IRowPinningFeature {
    datagrid: DatagridCore<TOriginalRow>;
    pinnedTopRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet([]);
    pinnedBottomRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet([]);

    // Cache for pinned rows
    private pinnedTopRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);
    private pinnedBottomRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowPinningFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    // Update the caches based on current processedRowsCache
    updatePinnedRows() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];



        for (let i = 0; i < this.datagrid.cacheManager.rows.length; i++) {
            const row = this.datagrid.cacheManager.rows[i];
            const rowIdentifier = row.identifier;
            if (this.pinnedTopRowIds.has(rowIdentifier)) {
                pinnedTop.push(row);
            } else if (this.pinnedBottomRowIds.has(rowIdentifier)) {
                pinnedBottom.push(row);
            } else {
                unpinned.push(row);
            }
        }

        this.pinnedTopRowsCache = pinnedTop;
        this.pinnedBottomRowsCache = pinnedBottom;
    }

    updatePinnedRowsInOrder() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];

        for (const rowIdentifier of this.pinnedTopRowIds) {
            const row = this.datagrid.rows.findRowById(rowIdentifier);
            if (row) pinnedTop.push(row);
        }

        // Iterate through all pinned bottom rows
        for (const rowIdentifier of this.pinnedBottomRowIds) {
            const row = this.datagrid.rows.findRowById(rowIdentifier);

            if (row) pinnedBottom.push(row);
        }

        // Iterate through all rows to populate unpinned array
        this.datagrid.cacheManager.rows.forEach(row => {
            const rowIdentifier = row.identifier;
            if (!this.pinnedTopRowIds.has(rowIdentifier) && !this.pinnedBottomRowIds.has(rowIdentifier)) {
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
            const rowId = row.identifier;
            const pinningState = this.getPinningState(rowId);

            if (row.isGroupRow()) {
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



    getTopRows(): GridRow<TOriginalRow>[] {
        return this.pinnedTopRowsCache;
    }

    getCenterRows(): GridRow<TOriginalRow>[] {
        return (this.datagrid.cacheManager.paginatedRows || []).filter(row => {
            const id = row.identifier;
            return !this.isPinnedTop(id) && !this.isPinnedBottom(id);
        });
    }


    getBottomRows(): GridRow<TOriginalRow>[] {
        return this.pinnedBottomRowsCache;
    }

    pinRowTop(rowIdentifier: GridRowIdentifier) {
        let row = this.datagrid.rows.findRowById(rowIdentifier);

        if (!row) return;

        if (row.isGroupRow()) {
            row = row as GridGroupRow<TOriginalRow>;
            // Pin the group itself
            this.pinnedTopRowIds.add(row.identifier);
            // Pin all descendants
            const descendantIndices = getGroupRowChildrenIds(row);
            descendantIndices.forEach(id => this.pinnedTopRowIds.add(id));
        } else {
            if (this.isPinnedTop(rowIdentifier)) this.pinnedTopRowIds.delete(rowIdentifier);
            else this.pinnedTopRowIds.add(rowIdentifier);

        }

        // Remove from bottom pins if necessary
        this.pinnedBottomRowIds.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    pinRowBottom(rowIdentifier: GridRowIdentifier) {
        const row = this.datagrid.rows.findRowById(rowIdentifier);

        if (!row) return;

        if (row.isGroupRow()) {
            // Pin the group itself
            this.pinnedBottomRowIds.add(row.identifier);
            // Pin all descendants
            const descendantIds = getGroupRowChildrenIds(row);
            descendantIds.forEach(id => this.pinnedBottomRowIds.add(id));
        } else {
            if (this.isPinnedBottom(rowIdentifier)) this.pinnedBottomRowIds.delete(rowIdentifier);
            else this.pinnedBottomRowIds.add(rowIdentifier);
        }

        // Remove from top pins if necessary
        this.pinnedTopRowIds.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    unpinRow(rowIdentifier: GridRowIdentifier) {
        const row = this.datagrid.rows.findRowById(rowIdentifier);
        if (!row) return;

        if (row.isGroupRow()) {
            // Unpin the group itself
            this.pinnedTopRowIds.delete(row.identifier);
            this.pinnedBottomRowIds.delete(row.identifier);
            // Unpin all descendants
            const descendantIds = getGroupRowChildrenIds(row);
            descendantIds.forEach(id => {
                this.pinnedTopRowIds.delete(id);
                this.pinnedBottomRowIds.delete(id);
            });
        } else {
            this.pinnedTopRowIds.delete(rowIdentifier);
            this.pinnedBottomRowIds.delete(rowIdentifier);
        }

        this.datagrid.processors.data.executeFullDataTransformation();
    }

    isPinnedTop(rowId: GridRowIdentifier): boolean {
        return this.pinnedTopRowIds.has(rowId);
    }

    isPinnedBottom(rowId: GridRowIdentifier): boolean {
        return this.pinnedBottomRowIds.has(rowId);
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
        this.pinnedTopRowIds.clear();
        this.pinnedBottomRowIds.clear();
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // Get all pinned row IDs
    getIdentifiersOfPinnedRows() {
        return {
            top: Array.from(this.pinnedTopRowIds),
            bottom: Array.from(this.pinnedBottomRowIds)
        };
    }

}