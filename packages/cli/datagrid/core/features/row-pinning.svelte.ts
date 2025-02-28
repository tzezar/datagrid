import { SvelteSet } from "svelte/reactivity";
import type { DatagridCore } from "../index.svelte";
import type { GridGroupRow, GridRow, GridRowIdentifier, RowPinningPosition } from "../types";


export type RowPinningFeatureState = {
    pinnedTopRowIds: SvelteSet<GridRowIdentifier>;
    pinnedBottomRowIds: SvelteSet<GridRowIdentifier>;
}

export type RowPinningFeatureConfig = Partial<RowPinningFeatureState>

export type IRowPinningFeature = {} & RowPinningFeatureState



/**
 * Class that implements the row pinning feature for a data grid.
 * Handles the pinning of rows to the top and bottom of the grid.
 *
 * @class RowPinningFeature
 * @template TOriginalRow The type of the original row data.
 */
export class RowPinningFeature<TOriginalRow = any> implements IRowPinningFeature {
    /**
     * The reference to the data grid core.
     * @type {DatagridCore<TOriginalRow>}
     */
    datagrid: DatagridCore<TOriginalRow>;

    /**
     * The set of row identifiers pinned to the top of the grid.
     * @type {SvelteSet<GridRowIdentifier>}
     */
    pinnedTopRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet([]);

    /**
     * The set of row identifiers pinned to the bottom of the grid.
     * @type {SvelteSet<GridRowIdentifier>}
     */
    pinnedBottomRowIds: SvelteSet<GridRowIdentifier> = new SvelteSet([]);

    /**
     * Cache for the pinned top rows.
     * @private
     * @type {GridRow<TOriginalRow>[]}
     */
    private pinnedTopRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);

    /**
     * Cache for the pinned bottom rows.
     * @private
     * @type {GridRow<TOriginalRow>[]}
     */
    private pinnedBottomRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);

    /**
     * Creates an instance of the row pinning feature.
     *
     * @param {DatagridCore<TOriginalRow>} datagrid - The data grid core instance.
     * @param {RowPinningFeatureConfig} [config] - Optional configuration for the row pinning feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: RowPinningFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    /**
     * Recursively retrieves all child row identifiers of a group row.
     *
     * @param {GridGroupRow<TOriginalRow>} row - The group row to process.
     * @returns {string[]} The identifiers of the children rows.
     */
    private getGroupRowChildrenIds<TOriginalRow>(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (child.isGroupRow()) {
                ids.push(child.identifier);
                ids.push(...this.getGroupRowChildrenIds(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }

    /**
     * Updates the caches for pinned rows based on the current rows in the data grid.
     */
    updatePinnedRows() {
        const pinnedTop: GridRow<TOriginalRow>[] = [];
        const pinnedBottom: GridRow<TOriginalRow>[] = [];
        const unpinned: GridRow<TOriginalRow>[] = [];



        for (let i = 0; i < this.datagrid.cacheManager.rows.length; i++) {
            const row = this.datagrid.cacheManager.rows[i];
            if (!row) continue;
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


    /**
  * Returns the rows in the grid, ordered with pinned rows (top, center, bottom).
  *
  * @param {GridRow<TOriginalRow>[]} rows - The rows to process.
  * @returns {GridRow<TOriginalRow>[]} The rows in pinned order.
  */
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


    /**
     * Retrieves the rows pinned to the top of the grid.
     *
     * @returns {GridRow<TOriginalRow>[]} The rows pinned to the top.
     */
    getTopRows(): GridRow<TOriginalRow>[] {
        return this.pinnedTopRowsCache;
    }


    /**
     * Retrieves the rows that are neither pinned to the top nor bottom.
     *
     * @returns {GridRow<TOriginalRow>[]} The unpinned rows.
     */
    getCenterRows(): GridRow<TOriginalRow>[] {
        return (this.datagrid.cacheManager.paginatedRows || []).filter(row => {
            const id = row.identifier;
            return !this.isPinnedTop(id) && !this.isPinnedBottom(id);
        });
    }


    /**
     * Retrieves the rows pinned to the bottom of the grid.
     *
     * @returns {GridRow<TOriginalRow>[]} The rows pinned to the bottom.
     */
    getBottomRows(): GridRow<TOriginalRow>[] {
        return this.pinnedBottomRowsCache;
    }

    /**
     * Pins a row to the top or bottom of the grid.
     *
     * @param {GridRowIdentifier} rowId - The identifier of the row to pin.
     * @param {RowPinningPosition} position - The position to pin the row ('top' or 'bottom').
     */
    pinRow(rowId: GridRowIdentifier, position: RowPinningPosition) {
        this.datagrid.events.emit('onRowPin', { rowId });

        if (position === 'top') this.pinRowTop(rowId);
        else if (position === 'bottom') this.pinRowBottom(rowId);
    }

    /**
     * Pins a row to the top of the grid.
     *
     * @private
     * @param {GridRowIdentifier} rowIdentifier - The identifier of the row to pin.
     */
    private pinRowTop(rowIdentifier: GridRowIdentifier) {
        let row = this.datagrid.rows.findRowById(rowIdentifier);

        if (!row) return;

        if (row.isGroupRow()) {
            row = row as GridGroupRow<TOriginalRow>;
            // Pin the group itself
            this.pinnedTopRowIds.add(row.identifier);
            // Pin all descendants
            const descendantIndices = this.getGroupRowChildrenIds(row);
            descendantIndices.forEach(id => this.pinnedTopRowIds.add(id));
        } else {
            if (this.isPinnedTop(rowIdentifier)) this.pinnedTopRowIds.delete(rowIdentifier);
            else this.pinnedTopRowIds.add(rowIdentifier);

        }

        // Remove from bottom pins if necessary
        this.pinnedBottomRowIds.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    /**
     * Pins a row to the bottom of the grid.
     *
     * @private
     * @param {GridRowIdentifier} rowIdentifier - The identifier of the row to pin.
     */
    private pinRowBottom(rowIdentifier: GridRowIdentifier) {

        const row = this.datagrid.rows.findRowById(rowIdentifier);

        if (!row) return;

        if (row.isGroupRow()) {
            // Pin the group itself
            this.pinnedBottomRowIds.add(row.identifier);
            // Pin all descendants
            const descendantIds = this.getGroupRowChildrenIds(row);
            descendantIds.forEach(id => this.pinnedBottomRowIds.add(id));
        } else {
            if (this.isPinnedBottom(rowIdentifier)) this.pinnedBottomRowIds.delete(rowIdentifier);
            else this.pinnedBottomRowIds.add(rowIdentifier);
        }

        // Remove from top pins if necessary
        this.pinnedTopRowIds.delete(rowIdentifier);
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    /**
     * Unpins a row from both the top and bottom pinning positions.
     *
     * @param {GridRowIdentifier} rowIdentifier - The identifier of the row to unpin.
     */
    unpinRow(rowIdentifier: GridRowIdentifier) {
        this.datagrid.events.emit('onRowUnpin', { rowIdentifier });
        const row = this.datagrid.rows.findRowById(rowIdentifier);
        if (!row) return;

        if (row.isGroupRow()) {
            // Unpin the group itself
            this.pinnedTopRowIds.delete(row.identifier);
            this.pinnedBottomRowIds.delete(row.identifier);
            // Unpin all descendants
            const descendantIds = this.getGroupRowChildrenIds(row);
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


    /**
     * Checks whether a row is pinned to the top of the grid.
     *
     * @param {GridRowIdentifier} rowId - The identifier of the row.
     * @returns {boolean} `true` if the row is pinned to the top, otherwise `false`.
     */
    isPinnedTop(rowId: GridRowIdentifier): boolean {
        return this.pinnedTopRowIds.has(rowId);
    }


    /**
     * Checks whether a row is pinned to the bottom of the grid.
     *
     * @param {GridRowIdentifier} rowId - The identifier of the row.
     * @returns {boolean} `true` if the row is pinned to the bottom, otherwise `false`.
     */
    isPinnedBottom(rowId: GridRowIdentifier): boolean {
        return this.pinnedBottomRowIds.has(rowId);
    }
    /**
     * Checks whether a row is pinned either at the top or the bottom.
     *
     * @param {GridRowIdentifier} rowId - The identifier of the row.
     * @returns {boolean} `true` if the row is pinned, otherwise `false`.
     */
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


    /**
     * Clears all pinned rows from both top and bottom.
     */
    clearPinnedRows() {
        this.pinnedTopRowIds.clear();
        this.pinnedBottomRowIds.clear();
        this.datagrid.processors.data.executeFullDataTransformation();
    }


    /**
     * Retrieves the identifiers of all pinned rows.
     *
     * @returns {{ top: string[], bottom: string[] }} The identifiers of pinned top and bottom rows.
     */
    getIdentifiersOfPinnedRows() {
        return {
            top: Array.from(this.pinnedTopRowIds),
            bottom: Array.from(this.pinnedBottomRowIds)
        };
    }

}