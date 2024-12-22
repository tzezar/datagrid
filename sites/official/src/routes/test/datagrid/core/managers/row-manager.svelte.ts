import type { Datagrid } from "../index.svelte";
import type { GridGroupRow, GridRow } from "../types";
import { isGridGroupRow } from "../utils.svelte";



export class RowManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    isGroupRowExpanded(row: GridGroupRow<TOriginalRow>) {
        return this.datagrid.grouping.expandedGroups.has(row.groupId);
    }

    toggleGroupRowExpansion(row: GridGroupRow<TOriginalRow>) {
        if (this.isGroupRowExpanded(row)) {
            this.datagrid.grouping.expandedGroups.delete(row.groupId);
        } else {
            this.datagrid.grouping.expandedGroups.add(row.groupId);
        }
        // invalide flatten cache
        this.datagrid.processors.data.executeFullDataTransformation();
    }

    getFlattenedRows(data: GridRow<TOriginalRow>[]): GridRow<TOriginalRow>[] {
        const flattened: GridRow<TOriginalRow>[] = [];

        for (const row of data) {
            flattened.push(row);
            if (isGridGroupRow(row)) {
                flattened.push(...this.getFlattenedRows(row.children));
            }
        }
        return flattened
    }

}

