import type { Datagrid } from "../index.svelte";
import type { GridRow } from "../types";

export class DatagridCacheManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;


    filteredOriginalRows: TOriginalRow[] = $state.raw([]);
    sortedOriginalRows: TOriginalRow[] = $state.raw([]);
    groupedRowsCache: GridRow<TOriginalRow>[] | null = $state.raw(null);
    
    flattenedRowsCache: GridRow<TOriginalRow>[] | null = $state.raw([]);
    _rows: GridRow<TOriginalRow>[] | null = $state.raw([]);
    paginatedRowsCache: GridRow<TOriginalRow>[] = $state.raw([]);

    invalidateGroupedRowsCache() {
        this.groupedRowsCache = null;
        this.flattenedRowsCache = null;
        this._rows = null;
    }

    getOrComputeGroupedRowsCache(data: TOriginalRow[]): GridRow<TOriginalRow>[] {
        if (this.groupedRowsCache === null) {
            this.groupedRowsCache = this.datagrid.processors.data.createHierarchicalData(data);
        }
        return this.groupedRowsCache;
    }

    get rows(): GridRow<TOriginalRow>[] {
        return this._rows || []
    }
    set rows(rows: GridRow<TOriginalRow>[]) {
        this._rows = rows;
    }


    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;

    }
}