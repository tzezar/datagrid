import { applyOffset } from "./fns/apply-offset";
import { filterData } from "./fns/filter-data";
import { paginateData } from "./fns/paginate-data";
import { sortData } from "./fns/sort-data";
import type { BaseColumn, ExpandedRows, Filter, SelectionPoint, SelectionRange, SelectionState, Sorting, Pagination } from "./types";
import { SvelteSet } from "svelte/reactivity";

export class TzezarDatagrid<T, C extends BaseColumn<T> = BaseColumn<T>> {
    mode: 'client' | 'server' = $state('client');

    // fast workaround for svelte-query bugs
    // ? maybe it is a good idea to add pre-made listeners for other events too?
    onPageChange = () => { };
    onPerPageChange = () => { };
    onSortingChange = () => { };
    onFiltersChange = () => { };
    onChange = () => { };
    identifier = $state('1');
    columns: C[] = $state([]);
    data: T[] = $state([]);
    title: string = $state('')
    state = $state({
        pagination: {
            page: 1,
            perPage: 20,
            count: 1
        } as Pagination,
        status: {
            isFetching: false,
            isError: false,
            isRefetching: false
        },
        sortingArray: [] as Sorting[],
        filters: [] as Filter[],
        expandedRows: [] as ExpandedRows,
        selectedRows: [] as T[],
        isFullscreenActive: false,
        isHeadFilterVisible: false
    });
    internal = $state({
        paginatedData: [] as T[],
        sortedData: [] as T[],
        filteredData: [] as T[],
        selectionState: {
            start: null as SelectionPoint | null,
            end: null as SelectionPoint | null,
            range: new SvelteSet() as SelectionRange,
            activeRange: new SvelteSet() as SelectionRange,
            isSelecting: false,
            isRemoving: false,
            isMouseDown: false
        } as SelectionState,
        keyboardNavigation: {
            focusedRowIndex: 0,
            focusedColumnIndex: 0
        },
        // ? this is optimization to make other functions like pagination more performant
        // ? it stores just ids as set instead of the whole row object
        selectedRowIds: new SvelteSet() as SvelteSet<number>,
        headSize: -1,
    });

    options = $state({
        scrollable: true,
        fullscreenMode: { enabled: true },
        pagination: { display: false, },
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
                displayMenu: {
                    enabled: false,
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
            selected: {
                label: 'md',
                vertical: '10px',
                horizontal: '10px',
            }
        },
        fontSize: {
            options: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.25rem',
                xl: '1.5rem',
            },
            selected: {
                label: 'md',
                value: '1rem',
            }
        },
    });

    // TODO: Rewrite this to be clener
    // * object assign does not work for some reason, dont have time rn to figure it out
    constructor({
        mode,
        columns,
        data,
        identifier,
        title,
        options,
        state,
        internal,
        onPageChange,
        onPerPageChange,
        onSortingChange,
        onFiltersChange,
        onChange
    }: ConstructorOptions & {
        columns: C[],
        data: T[],
    }) {
        this.onPageChange = onPageChange || this.onPageChange
        this.onPerPageChange = onPerPageChange || this.onPerPageChange
        this.onSortingChange = onSortingChange || this.onSortingChange
        this.onFiltersChange = onFiltersChange || this.onFiltersChange
        this.onChange = onChange || this.onChange

        this.columns = applyOffset(columns) as C[]
        this.data = data;
        // provide defaults for SSR
        this.internal.sortedData = sortData([...data], this.state.sortingArray)
        this.internal.filteredData = filterData([...this.internal.sortedData], this.state.filters)
        this.internal.paginatedData = paginateData([...this.internal.sortedData], this.state.pagination.page, this.state.pagination.perPage)

        this.identifier = identifier || this.identifier;

        // options
        this.options.scrollable = options?.scrollable ?? this.options.scrollable
        this.options.fullscreenMode = options?.fullscreenMode ?? this.options.fullscreenMode
        this.options.pagination = options?.pagination ?? this.options.pagination
        this.options.statusIndicator = options?.statusIndicator ?? this.options.statusIndicator
        this.options.dataIndicator = options?.dataIndicator ?? this.options.dataIndicator
        this.options.footer = options?.footer ?? this.options.footer
        this.options.topbar.display = options?.topbar?.display ?? this.options.topbar.display
        this.title = title ?? this.title
        this.options.rows.striped = options?.rows?.striped ?? this.options.rows.striped

        this.options.topbar.displayFullscreenToggle = options?.topbar?.displayFullscreenToggle ?? this.options.topbar.displayFullscreenToggle
        this.options.topbar.displayExportDataMenu = options?.topbar?.displayExportDataMenu ?? this.options.topbar.displayExportDataMenu
        this.options.topbar.displayCopyDataMenu = options?.topbar?.displayCopyDataMenu ?? this.options.topbar.displayCopyDataMenu

        this.options.topbar.displayHeadFilterToggle = options?.topbar?.displayHeadFilterToggle ?? this.options.topbar.displayHeadFilterToggle

        this.options.topbar.settingsMenu.display = options?.topbar?.settingsMenu?.display ?? this.options.topbar.settingsMenu.display

        this.options.topbar.settingsMenu.displaySortingMenu = options?.topbar?.settingsMenu?.displaySortingMenu ?? this.options.topbar.settingsMenu.displaySortingMenu
        this.options.topbar.settingsMenu.displayReoderingMenu = options?.topbar?.settingsMenu?.displayReoderingMenu ?? this.options.topbar.settingsMenu.displayReoderingMenu

        this.options.topbar.settingsMenu.displayFreezingMenu = options?.topbar?.settingsMenu?.displayFreezingMenu ?? this.options.topbar.settingsMenu.displayFreezingMenu
        this.options.topbar.settingsMenu.displayVisibilityMenu = options?.topbar?.settingsMenu?.displayVisibilityMenu ?? this.options.topbar.settingsMenu.displayVisibilityMenu



        this.options.topbar.settingsMenu.displayResizingMenu = options?.topbar?.settingsMenu?.displayResizingMenu ?? this.options.topbar.settingsMenu.displayResizingMenu
        this.options.topbar.settingsMenu.displayMenu.enabled = options?.topbar?.settingsMenu?.displayMenu?.enabled ?? this.options.topbar.settingsMenu.displayMenu.enabled
        this.options.topbar.settingsMenu.displayMenu.displaySpacingMenu = options?.topbar?.settingsMenu?.displayMenu?.displaySpacingMenu ?? this.options.topbar.settingsMenu.displayMenu.displaySpacingMenu
        this.options.topbar.settingsMenu.displayMenu.displayTextSizeMenu = options?.topbar?.settingsMenu?.displayMenu?.displayTextSizeMenu ?? this.options.topbar.settingsMenu.displayMenu.displayTextSizeMenu

        this.mode = mode || this.mode

        this.state.pagination.count = state?.pagination?.count || this.state.pagination.count
        this.state.pagination.page = state?.pagination?.page || this.state.pagination.page
        this.state.pagination.perPage = state?.pagination?.perPage || this.state.pagination.perPage

        this.state.status.isFetching = state?.status?.isFetching || this.state.status.isFetching
        this.state.status.isError = state?.status?.isError || this.state.status.isError
        this.state.status.isRefetching = state?.status?.isRefetching || this.state.status.isRefetching

        this.state.sortingArray = state?.sortingArray || this.state.sortingArray

        this.state.expandedRows = state?.expandedRows || this.state.expandedRows

        this.state.selectedRows = state?.selectedRows || this.state.selectedRows

        this.state.isFullscreenActive = state?.isFullscreenActive || this.state.isFullscreenActive

        this.state.isHeadFilterVisible = state?.isHeadFilterVisible || this.state.isHeadFilterVisible

        this.state.filters = state?.filters || this.state.filters

        this.internal.paginatedData = internal?.paginatedData || this.internal.paginatedData

        this.internal.sortedData = internal?.sortedData || this.internal.sortedData

        this.internal.filteredData = internal?.filteredData || this.internal.filteredData

    }
}


export type ConstructorOptions = {
    mode?: 'client' | 'server',
    onPageChange?: () => void,
    onPerPageChange?: () => void,
    onSortingChange?: () => void,
    onFiltersChange?: () => void,
    onChange?: () => void,
    identifier?: string,
    title?: string,

    state?: {
        pagination?: {
            page?: number,
            perPage?: number,
            count?: number
        },
        status?: {
            isFetching?: boolean,
            isError?: boolean,
            isRefetching?: boolean
        },
        sortingArray?: [],
        filters?: [],
        expandedRows?: [],
        selectedRows?: [],
        isFullscreenActive?: boolean,
        isHeadFilterVisible?: boolean
    },
    internal?: {
        paginatedData?: [],
        sortedData?: [],
        filteredData?: [],
    },



    options?: {
        scrollable?: boolean,
        fullscreenMode?: {
            enabled: boolean
        },
        pagination?: {
            display: boolean
        },
        statusIndicator?: {
            display: boolean
        },
        dataIndicator?: {
            display: boolean
        },
        footer?: {
            display: boolean
        }
        topbar?: {
            display: boolean,
            displayFullscreenToggle?: boolean,
            displayExportDataMenu?: boolean,
            displayCopyDataMenu?: boolean,
            displayHeadFilterToggle?: boolean,
            settingsMenu?: {
                display: boolean,
                displaySortingMenu?: boolean,
                displayReoderingMenu?: boolean,
                displayFreezingMenu?: boolean,
                displayResizingMenu?: boolean,
                displayVisibilityMenu?: boolean,
                displayMenu?: {
                    enabled: boolean,
                    displaySpacingMenu?: boolean,
                    displayTextSizeMenu?: boolean
                }
            }
        }
        rows?: {
            striped: boolean
        },
    }
}

