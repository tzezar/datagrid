import { BaseService } from "./base-service";

export class SearchService extends BaseService {
    updateSearchQuery(value: string) {
        this.datagrid.features.globalSearch.updateSearchQuery(value)
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cacheManager.invalidate('filteredData');
        
        this.datagrid.processors.data.executeFullDataTransformation();
    }
}