import { applyOffset } from "./fns/apply-offset";
import { filterData } from "./fns/filter-data";
import { paginateData } from "./fns/paginate-data";
import { sortData } from "./fns/sort-data";
import type { BaseColumn, ExpandedRows, Filter, FontSize, Pagination, SelectionState, Sorting } from "./types";
import { SvelteSet } from "svelte/reactivity";

export class TzezarDatagrid<T, C extends BaseColumn<T> = BaseColumn<T>> {
    // Public properties
    mode = $state('client');
    columns = $state<C[]>([]);
    data = $state<T[]>([]);
    title = $state('');
    identifier = $state('1');

    // Lifecycle hooks
    onPageChange = () => { };
    onPerPageChange = () => { };
    onSortingChange = () => { };
    onFiltersChange = () => { };
    onChange = () => { };

    // State management
    state = $state({
        pagination: { page: 1, perPage: 20, count: 1 } as Pagination,
        status: { isFetching: false, isError: false, isRefetching: false },
        sortingArray: [] as Sorting[],
        filters: [] as Filter[],
        expandedRows: [] as ExpandedRows,
        selectedRows: [] as T[],
        isFullscreenActive: false,
        isHeadFilterVisible: false
    });

    // Internal state
    internal = $state({
        paginatedData: [] as T[],
        sortedData: [] as T[],
        filteredData: [] as T[],
        selectionState: {
            start: null,
            end: null,
            range: new SvelteSet(),
            activeRange: new SvelteSet(),
            isSelecting: false,
            isRemoving: false,
            isMouseDown: false
        } as SelectionState,
        keyboardNavigation: { focusedRowIndex: 0, focusedColumnIndex: 0 },
        selectedRowIds: new SvelteSet<number>(),
        headSize: -1,
    });

    // Options
    options = $state({
        scrollable: true,
        fullscreenMode: { enabled: true },
        pagination: { display: false },
        dataIndicator: { display: true },
        statusIndicator: { display: true },
        rows: { striped: false },
        topbar: {
            display: false,
            displayFullscreenToggle: false,
            displayExportDataMenu: false,
            displayCopyDataMenu: false,
            displayHeadFilterToggle: false,
            settingsMenu: {
                display: false,
                displaySortingMenu: true,
                displayReoderingMenu: true,
                displayFreezingMenu: true,
                displayResizingMenu: true,
                displayVisibilityMenu: true,
                adjustmentMenu: {
                    display: true,
                    displaySpacingMenu: true,
                    displayTextSizeMenu: true
                }
            }
        },
        footer: { display: false },
        spacing: {
            options: {
                none: { vertical: '0px', horizontal: '0px' },
                xs: { vertical: '3px', horizontal: '3px' },
                sm: { vertical: '5px', horizontal: '5px' },
                md: { vertical: '10px', horizontal: '10px' },
                lg: { vertical: '20px', horizontal: '20px' },
                xl: { vertical: '30px', horizontal: '30px' },
            },
            selected: { label: 'md', vertical: '10px', horizontal: '10px' }
        },
        fontSize: {
            options: {
                xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.5rem',
            },
            selected: { label: 'md', value: '1rem' }
        } as FontSize
    });

    constructor(config: TzezarDatagridConfig<T, C>) {
        this.initializeFromConfig(config);
        this.initializeData();
    }

    // Initialize the datagrid with the provided configuration
    private initializeFromConfig(config: TzezarDatagridConfig<T, C>) {
        const { mode, columns, data, identifier, title, options, state, onPageChange, onPerPageChange, onSortingChange, onFiltersChange, onChange } = config;

        // Set core properties
        this.mode = mode || this.mode;
        // @ts-expect-error ts(2322) 
        this.columns = applyOffset(columns);
        this.data = data;
        this.identifier = identifier || this.identifier;
        this.title = title || this.title;

        // Set event handlers
        this.onPageChange = onPageChange || this.onPageChange;
        this.onPerPageChange = onPerPageChange || this.onPerPageChange;
        this.onSortingChange = onSortingChange || this.onSortingChange;
        this.onFiltersChange = onFiltersChange || this.onFiltersChange;
        this.onChange = onChange || this.onChange;

        // Initialize state
        this.initializeState(state);

        // Initialize options
        this.initializeOptions(options);
    }

    // Initialize state with provided values or defaults
    private initializeState(state?: Partial<typeof this.state>) {
        if (state) {
            Object.assign(this.state, state);
        }
    }

    // Initialize options with provided values or defaults
    private initializeOptions(options?: Partial<typeof this.options>) {
        if (options) {
            Object.assign(this.options, options);
        }
    }

    // Initialize data by sorting, filtering, and paginating
    private initializeData() {
        this.internal.sortedData = sortData([...this.data], this.state.sortingArray);
        this.internal.filteredData = filterData([...this.internal.sortedData], this.state.filters);
        this.internal.paginatedData = paginateData([...this.internal.filteredData], this.state.pagination.page, this.state.pagination.perPage);
    }
    // Public methods
    updateData(newData: T[]) {
        this.data = newData;
    }

    updateColumns(newColumns: C[]) {
        //@ts-expect-error ts(2322)
        this.columns = applyOffset(newColumns);
    }

    updatePagination(page: number, perPage: number) {
        this.state.pagination.page = page;
        this.state.pagination.perPage = perPage;
        this.onPageChange();
        this.onPerPageChange();
        this.onChange();
    }

    updateSorting(newSorting: Sorting[]) {
        this.state.sortingArray = newSorting;
        this.onSortingChange();
        this.onChange();
    }

    updateFilters(newFilters: Filter[]) {
        this.state.filters = newFilters;
        this.state.pagination.page = 1;
        this.onFiltersChange();
        this.onChange();
    }

    toggleFullscreen() {
        this.state.isFullscreenActive = !this.state.isFullscreenActive;
    }

    toggleHeadFilter() {
        this.state.isHeadFilterVisible = !this.state.isHeadFilterVisible;
    }
}

// Configuration type for the TzezarDatagrid constructor
type TzezarDatagridConfig<T, C extends BaseColumn<T>> = {
    mode?: 'client' | 'server';
    columns: C[];
    data: T[];
    identifier?: string;
    title?: string;
    options?: Partial<TzezarDatagrid<T, C>['options']>;
    state?: Partial<TzezarDatagrid<T, C>['state']>;
    onPageChange?: () => void;
    onPerPageChange?: () => void;
    onSortingChange?: () => void;
    onFiltersChange?: () => void;
    onChange?: () => void;
};
