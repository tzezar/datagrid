import type { DatagridCore } from "../index.svelte";
import type { EventService } from "./event-service";

/**
 * Base class for service operations related to the datagrid, providing shared functionality such as refreshing the grid.
 */
export class BaseService {
    /**
     * Creates an instance of the BaseService class.
     * 
     * @param {DatagridCore<any>} datagrid The core datagrid instance.
     * @param {EventService} events The event service used for emitting events.
     */
    constructor(
        protected datagrid: DatagridCore<any>,
        protected events: EventService
    ) {}

    /**
     * Refreshes the datagrid, optionally invalidating cache and triggering a full data transformation.
     * 
     * @param {Object} options The options for refreshing the grid.
     * @param {string[]} [options.cache] List of cache keys to invalidate.
     * @param {boolean} [options.fullRefresh=false] Whether to perform a full data transformation.
     */
    protected refreshGrid(options: { 
        cache?: string[], 
        fullRefresh?: boolean 
    } = {}) {
        const { cache = [], fullRefresh = false } = options;
        
        // Invalidate the specified cache keys
        cache.forEach(key => this.datagrid.cacheManager.invalidate(key as any));

        // Optionally perform a full data transformation
        if (fullRefresh) {
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }
}
