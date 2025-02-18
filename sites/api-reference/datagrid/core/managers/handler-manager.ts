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

/**
 * Manages handlers for various services within the datagrid.
 * Provides access to services for column control, filtering, global search,
 * grouping, pagination, row operations, sorting, and editing.
 * 
 * @class HandlersManager
 */
export class HandlersManager {
    /**
     * Service to manage column controls such as visibility, ordering, etc.
     * @readonly
     * @type {ColumnControlService}
     */
    readonly column: ColumnControlService;

    /**
     * Service to manage filtering functionality within the datagrid.
     * @readonly
     * @type {FilteringService}
     */
    readonly filtering: FilteringService;

    /**
     * Service to manage global search functionality.
     * @readonly
     * @type {SearchService}
     */
    readonly globalSearch: SearchService;

    /**
     * Service to manage grouping functionality within the datagrid.
     * @readonly
     * @type {GroupingService}
     */
    readonly grouping: GroupingService;

    /**
     * Service to manage pagination functionality within the datagrid.
     * @readonly
     * @type {PaginationService}
     */
    readonly pagination: PaginationService;

    /**
     * Service to manage row operations such as selection, expansion, etc.
     * @readonly
     * @type {RowService}
     */
    readonly rows: RowService;

    /**
     * Service to manage sorting functionality within the datagrid.
     * @readonly
     * @type {SortingService}
     */
    readonly sorting: SortingService;

    /**
     * Service to manage editing functionality for rows within the datagrid.
     * @readonly
     * @type {EditingService}
     */
    readonly editing: EditingService;

    /**
     * Creates an instance of the HandlersManager, initializing all the necessary services.
     * 
     * @param {DatagridCore} datagrid - The core datagrid instance to which services will be bound.
     * @param {EventService} eventService - The event service used for event-driven interactions between services.
     */
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
