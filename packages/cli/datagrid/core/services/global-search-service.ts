import { BaseService } from "./base-service";

/**
 * Service for managing the global search functionality in the data grid.
 * It handles updating the search query, resetting pagination, and triggering data transformations.
 * 
 * @extends BaseService
 */
export class SearchService extends BaseService {

    /**
     * Updates the global search query and triggers necessary actions to filter the data.
     * This includes resetting pagination, invalidating cached filtered data, and transforming the data based on the updated query.
     * 
     * @param {string} value The search query to update the global search with.
     * Refreshes the data grid, invalidates the cached filtered data, and recalculates the data transformation.
     */
    updateSearchQuery(value: string) {
        this.datagrid.features.globalSearch.updateSearchQuery(value);
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidate('filteredData');
        
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}
