import type { Datagrid } from "../index.svelte";
import type { GridRow } from "../types";

/**
 * Manages cache for a datagrid, including sorted, filtered, and grouped rows.
 * Provides methods to invalidate and update caches when data changes.
 * 
 * @template TOriginalRow The type of the original row data.
 */
export class DatagridCacheManager<TOriginalRow> {
    /**
     * The datagrid instance associated with this cache manager.
     * @type {Datagrid<TOriginalRow>}
     */
    datagrid: Datagrid<TOriginalRow>;

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
     * Cached hierarchical rows. Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] | null}
     * @private
     */
    hierarchicalRows: GridRow<TOriginalRow>[] | null = $state.raw(null);

    /**
     * Either grouped rows that are flattened or basic rows when there is no grouping.
     * Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] | null}
     */
    rows: GridRow<TOriginalRow>[] | null = $state.raw(null);

    /**
     * Cached paginated rows. Null if the cache is invalid.
     * @type {GridRow<TOriginalRow>[] | null}
     * @private
     */
    paginatedRows: GridRow<TOriginalRow>[] | null = $state(null);

    /**
     * Creates an instance of DatagridCacheManager.
     * 
     * @param {Datagrid<TOriginalRow>} datagrid The datagrid instance to manage.
     */
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    /**
     * Invalidates the cache for grouped rows, forcing a recalculation.
     */
    invalidateGroupedRowsCache(): void {
        this.hierarchicalRows = null;
        this.rows = null;
    }
}
