import type { DataGrid } from "../index.svelte";
import type { GridRow } from "../types";


/**
 * Manages cache for a datagrid, including sorted, filtered, and grouped rows.
 * Provides methods to invalidate and update caches when data changes.
 * 
 * @template TOriginalRow The type of the original row data.
 */
export class DatagridCacheManager<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;

    sortedData: TOriginalRow[] | null = $state.raw(null);
    filteredData: TOriginalRow[] | null = $state.raw(null);

    paginatedRows: GridRow<TOriginalRow>[] | null = $state(null);

    /**
     * Either grouped rows that are flattened or basic rows when there is no grouping.
     * Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] }
    */
    rows: GridRow<TOriginalRow>[] = $state.raw([]);

    /**
     *  Rows with hierarchical structure, present only when grouping is enabled. Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] }
     */
    hierarchicalRows: GridRow<TOriginalRow>[] | null = $state.raw(null);

    // visibleRows: GridRow<TOriginalRow>[] = $state.raw([]);



    /**
     * Invalidates the specified data in the cache.
     * @param target  Use 'everything' if not sure what to invalidate.
     */
    invalidate(target: "everything" | 'sortedData' | 'filteredData' | 'hierarchicalRows' | 'rows' | 'paginatedRows') {
        switch (target) {
            case 'everything':
                this.invalidateCache();
                break;
            case 'sortedData':
                this.invalidateSortedData();
                break;
            case 'filteredData':
                this.invalidateFilteredData();
                break;
            case 'hierarchicalRows':
                this.invalidateHierarchicalRows();
                break;
            case 'rows':
                this.invalidateRows();
                break;
            case 'paginatedRows':
                this.invalidatePaginatedRows();
                break;
        }
    }

    invalidateGroupedRowsCache(): void {
        // Only clear the flattened views, keep hierarchical structure
        this.rows = [];
        this.paginatedRows = null;
    }

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }


    private invalidateSortedData(): void {
        this.sortedData = null;
    }

    private invalidateFilteredData(): void {
        this.filteredData = null;
    }

    private invalidateHierarchicalRows(): void {
        this.hierarchicalRows = null;
    }

    private invalidateRows(): void {
        this.rows = [];
    }

    private invalidatePaginatedRows(): void {
        this.paginatedRows = null;
    }

    private invalidateCache(): void {
        this.invalidateSortedData();
        this.invalidateFilteredData();
        this.invalidateHierarchicalRows();
        this.invalidateRows();
        this.invalidatePaginatedRows();
    }

}
