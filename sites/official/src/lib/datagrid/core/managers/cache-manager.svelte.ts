import type { Datagrid } from "../index.svelte";
import type { GridRow } from "../types";

/**
 * Manages cache for a datagrid, including sorted, filtered, and grouped rows.
 * Provides methods to invalidate and update caches when data changes.
 * 
 * @template TOriginalRow The type of the original row data.
 */
export class DatagridCacheManager<TOriginalRow> {

    datagrid: Datagrid<TOriginalRow>;

    sortedData: TOriginalRow[] | null = $state.raw(null);

    filteredData: TOriginalRow[] | null = $state.raw(null);

    hierarchicalRows: GridRow<TOriginalRow>[] | null = $state.raw(null);

    /**
     * Either grouped rows that are flattened or basic rows when there is no grouping.
     * Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] }
     */
    rows: GridRow<TOriginalRow>[] = $state.raw([]);
    
    visibleRows: GridRow<TOriginalRow>[] = $state.raw([]);


    paginatedRows: GridRow<TOriginalRow>[] | null = $state(null);



    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    invalidateGroupedRowsCache(): void {
        // Only clear the flattened views, keep hierarchical structure
        this.rows = [];
        this.paginatedRows = null;
    }

    invalidateAllCaches(): void {
        this.sortedData = null;
        this.filteredData = null;
        this.hierarchicalRows = null;
        this.visibleRows = [];
        this.rows = [];
        this.paginatedRows = null;
    }

    invalidateFilteredDataCache(): void {
        this.filteredData = null;
    }
    invalidateHierarchicalRowsCache(): void {
        this.hierarchicalRows = null;
    }


}
