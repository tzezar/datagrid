import type { DatagridCore } from "../index.svelte";
import type { GridRow } from "../types";


/**
 * Manages cache for a datagrid, including sorted, filtered, and grouped rows.
 * Provides methods to invalidate and update caches when data changes.
 * 
 * @template TOriginalRow The type of the original row data.
 */
export class DatagridCacheManager<TOriginalRow> {
    /**
     * The core datagrid instance that the cache manager is associated with.
     * @type {DatagridCore<TOriginalRow>}
     */
    datagrid: DatagridCore<TOriginalRow>;

    /**
     * Cached sorted data. Null if the cache is invalid.
     * @type {TOriginalRow[] | null}
     */
    sortedData: TOriginalRow[] | null = $state.raw(null);

    /**
     * Cached filtered data. Null if the cache is invalid.
     * @type {TOriginalRow[] | null}
     */
    filteredData: TOriginalRow[] | null = $state.raw(null);

    /**
     * Cached paginated rows. Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] | null}
     */
    paginatedRows: GridRow<TOriginalRow>[] | null = $state(null);

    /**
     * Either grouped rows that are flattened or basic rows when there is no grouping.
     * Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[]}
     */
    rows: GridRow<TOriginalRow>[] = $state.raw([]);

    /**
     * Rows with hierarchical structure, present only when grouping is enabled.
     * Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] | null}
     */
    hierarchicalRows: GridRow<TOriginalRow>[] | null = $state.raw(null);

    /**
     * Invalidates the specified data in the cache.
     * @param target The type of cache to invalidate. Options are:
     *               - 'everything' to invalidate all caches.
     *               - 'sortedData' to invalidate the sorted data cache.
     *               - 'filteredData' to invalidate the filtered data cache.
     *               - 'hierarchicalRows' to invalidate the hierarchical rows cache.
     *               - 'rows' to invalidate the basic rows cache.
     *               - 'paginatedRows' to invalidate the paginated rows cache.
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

    /**
     * Clears the flattened views of the grouped rows while keeping the hierarchical structure intact.
     */
    invalidateGroupedRowsCache(): void {
        this.rows = [];
        this.paginatedRows = null;
    }

    /**
     * Creates an instance of DatagridCacheManager for a specific datagrid.
     * @param datagrid The core datagrid instance.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // Private methods to invalidate specific parts of the cache
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
