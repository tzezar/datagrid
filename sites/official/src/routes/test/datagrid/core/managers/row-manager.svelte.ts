import type { Datagrid } from "../index.svelte";
import type { GridBasicRow, GridGroupRow, GridRow, GridRowIdentifier } from "../types";
import { isGridGroupRow, isGroupRow } from "../utils.svelte";



export class RowManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
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
        // invalide flatten cache
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    // TODO Move this out
    flattenGridRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (isGridGroupRow(row)) {
                flattened.push(...this.flattenGridRows(row.children));
            }
        }

        return flattened

    }

    findRowByIndex(index: string): GridRow<TOriginalRow> | undefined {
        return this.datagrid.cache.rows.find(row => row.index === index);
    }

    findRowByIdentifier(identifier: GridRowIdentifier): GridRow<TOriginalRow> | undefined {
        return this.getFlatGridBasicRows(this.datagrid.cache.rows).find(row => row.identifier === identifier);
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



    getAllDescendantIndices(row: GridGroupRow<TOriginalRow>): string[] {
        const ids: string[] = [];
        for (const child of row.children) {
            if (isGroupRow(child)) {
                ids.push(child.identifier);
                ids.push(...this.getAllDescendantIndices(child));
            } else {
                ids.push(child.index);
            }
        }

        return ids;
    }


}

