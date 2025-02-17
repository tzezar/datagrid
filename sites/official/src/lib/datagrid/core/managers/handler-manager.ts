import type { DatagridCore } from "../index.svelte";
import { ColumnControlService } from "../services/column-control-service";
import { EditingService } from "../services/editing-service.svelte";
import { EventService } from "../services/event-service";
import { FilteringService } from "../services/filtering-service.svelte";
import { SearchService } from "../services/global-search-service";
import { GroupingService } from "../services/grouping-service";
import { PaginationService } from "../services/pagination-service";
import { RowService } from "../services/row-service.svelte";
import { SortingService } from "../services/sorting-service";

export class HandlersManager {
    readonly column: ColumnControlService;
    readonly filtering: FilteringService
    readonly globalSearch: SearchService
    readonly grouping: GroupingService
    readonly pagination: PaginationService
    readonly rows: RowService
    readonly sorting: SortingService;
    readonly editing: EditingService


    constructor(datagrid: DatagridCore<any>, eventService: EventService) {
        this.sorting = new SortingService(datagrid, eventService);
        this.column = new ColumnControlService(datagrid, eventService);
        this.filtering = new FilteringService(datagrid, eventService);
        this.globalSearch = new SearchService(datagrid, eventService);
        this.grouping = new GroupingService(datagrid, eventService);
        this.pagination = new PaginationService(datagrid, eventService);
        this.rows = new RowService(datagrid, eventService);
        this.editing = new EditingService(datagrid, eventService);
    }
}