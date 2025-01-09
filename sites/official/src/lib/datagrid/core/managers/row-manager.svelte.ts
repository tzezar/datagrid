import type { DataGrid } from "../index.svelte";
import type { GridBasicRow, GridGroupRow, GridRow, GridRowIdentifier } from "../types";
import { isGridGroupRow, isGroupRow } from "../utils.svelte";



export class RowManager<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    isGroupRowExpanded(row: GridGroupRow<TOriginalRow>) {
        return this.datagrid.grouping.expandedGroups.has(row.identifier);
    }

    toggleGroupRowExpansion(row: GridGroupRow<TOriginalRow>) {
        if (this.isGroupRowExpanded(row)) {
            this.datagrid.grouping.expandedGroups.delete(row.identifier);
        } else {
            this.datagrid.grouping.expandedGroups.add(row.identifier);
        }

         // Only invalidate the flattened view cache
         this.datagrid.cacheManager.invalidateGroupedRowsCache();

         // Use the new optimized method instead of full transformation
         this.datagrid.processors.data.handleGroupExpansion();
    }

    findRowByIdentifier(identifier: GridRowIdentifier): GridRow<TOriginalRow> | undefined {
        return (this.datagrid.cacheManager.rows || []).find(row => row.identifier === identifier);
    }

    // new
    getFlatGridBasicRows(data: GridRow<TOriginalRow>[]): GridBasicRow<TOriginalRow>[] {
        const flattened: GridBasicRow<TOriginalRow>[] = [];
        for (const row of data) {
            if (isGridGroupRow(row)) {
                flattened.push(...this.getFlatGridBasicRows(row.children));
            } else {
                flattened.push(row as GridBasicRow<TOriginalRow>);
            }
        }
        return flattened;
    }

    getFlatGridRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];
        for (const row of data) {
            if (isGridGroupRow(row)) {
                flattened.push(row);
                flattened.push(...this.getFlatGridRows(row.children));
            } else {
                flattened.push(row);
            }
        }
        return flattened;
    }

    getFlatGridGroupRows(data: GridRow<TOriginalRow>[]): GridGroupRow<TOriginalRow>[] {
        const flattened: GridGroupRow<TOriginalRow>[] = [];
        for (const row of data) {
            if (isGridGroupRow(row)) {
                flattened.push(row);
                flattened.push(...this.getFlatGridGroupRows(row.children));
            }
        }
        return flattened;
    }


    getRowIdentifier(row: GridRow<TOriginalRow>): GridRowIdentifier {
        return row.identifier
    }



    getAllDescendantIndifiers(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (isGroupRow(child)) {
                ids.push(child.identifier);
                ids.push(...this.getAllDescendantIndifiers(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }
    getAllDescendantIndices(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (isGroupRow(child)) {
                ids.push(child.identifier);
                ids.push(...this.getAllDescendantIndifiers(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }

}

