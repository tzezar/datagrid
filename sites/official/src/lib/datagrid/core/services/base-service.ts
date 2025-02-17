import type { DatagridCore } from "../index.svelte";
import type { EventService } from "./event-service";

export class BaseService {
    constructor(
        protected datagrid: DatagridCore<any>,
        protected events: EventService
    ) {}

    protected refreshGrid(options: { 
        cache?: string[], 
        fullRefresh?: boolean 
    } = {}) {
        const { cache = [], fullRefresh = false } = options;
        cache.forEach(key => this.datagrid.cacheManager.invalidate(key as any));
        
        if (fullRefresh) {
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }
}