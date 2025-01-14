import type { DataGrid } from "../index.svelte";
import type {  GridGroupRow, GridRow, GridRowIdentifier } from "../types";




export class RowManager<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    getVisibleRows(): GridRow<TOriginalRow>[] {
        const topRows = this.datagrid.features.rowPinning.getTopRows();
        const bottomRows = this.datagrid.features.rowPinning.getBottomRows();
        const centerRows = this.datagrid.features.rowPinning.getCenterRows();
        return [...topRows, ...centerRows, ...bottomRows];
    }
    
    isGroupRowExpanded(row: GridGroupRow<TOriginalRow>) {
        return this.datagrid.features.grouping.expandedGroups.has(row.identifier);
    }

    toggleGroupRowExpansion(row: GridGroupRow<TOriginalRow>) {
        if (this.isGroupRowExpanded(row)) {
            this.datagrid.features.grouping.expandedGroups.delete(row.identifier);
        } else {
            this.datagrid.features.grouping.expandedGroups.add(row.identifier);
        }

         // Only invalidate the flattened view cache
         this.datagrid.cache.invalidateGroupedRowsCache();

         // Use the new optimized method instead of full transformation
         this.datagrid.processors.data.handleGroupExpansion();
    }

    findRowByIdentifier(identifier: GridRowIdentifier): GridRow<TOriginalRow> | undefined {
        return (this.datagrid.cache.rows || []).find(row => row.identifier === identifier);
    }

    getAllDescendantIndifiers(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (child.isGroupRow()) {
                ids.push(child.identifier);
                ids.push(...this.getAllDescendantIndifiers(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }
  

}

