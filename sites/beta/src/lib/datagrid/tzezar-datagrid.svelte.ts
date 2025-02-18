import { applyOffset } from "./fns/apply-offset"; // Utility function to apply offsets for column alignment
import { filterData } from "./fns/filter-data"; // Function to filter data based on active filters
import { paginateData } from "./fns/paginate-data"; // Function to handle pagination of the data set
import { sortData } from "./fns/sort-data"; // Function to sort the data based on specified criteria
import type { BaseColumn, ExpandedRows, Filter, FontSize, Pagination, SelectionState, Sorting, SpacingConfig } from "./types"; // Importing relevant types for TypeScript type checking
import { SvelteSet } from "svelte/reactivity"; // Svelte's reactive set implementation


// New types for aggregation
type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';

interface AggregationConfig {
  field: string;
  type: AggregationType;
  label?: string;
}

export interface GroupConfig {
  field: keyof T;
  aggregations?: AggregationConfig[];
}

type Aggregates = Record<string, { key: AggregationType, number: number }>[]

interface GroupedItem<T> {
  key: any;
  groupBy: keyof T;
  level: number;
  items: (T | GroupedItem<T>)[];
  aggregates?: Aggregates;
}

// Recursive Partial type
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Helper function to perform a deep merge of objects
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        output[key] = deepMerge(output[key] as any, source[key] as any);
      } else {
        output[key] = source[key] as any;
      }
    }
  }
  return output;
}

/**
 * TzezarDatagrid is a generic class representing a configurable data grid component.
 * It supports various features including sorting, filtering, pagination, and selection of data rows.
 * 
 * @template T - The type of data items that will populate the grid.
 * @template C - The type of column configuration extending from BaseColumn.
 */
export class TzezarDatagrid<T, C extends BaseColumn<T> = BaseColumn<T>> {
  // Public properties
  mode = $state('client'); // Default mode set to client-side; allows for flexibility in data handling
  columns = $state<C[]>([]); // Stores the configuration for the grid columns
  data = $state<T[]>([]); // Holds the actual data items displayed in the grid
  title = $state(''); // Allows for a user-defined title for the data grid
  identifier = $state('1'); // Unique identifier for this grid instance, useful for state management

  // Lifecycle hooks for event handling
  onPageChange = () => { }; // Callback triggered on page changes, allows for custom logic to be applied
  onPerPageChange = () => { }; // Callback triggered when the number of items per page is modified
  onSortingChange = () => { }; // Callback for when sorting criteria are altered
  onFiltersChange = () => { }; // Callback for when filters are updated
  onChange = () => { }; // General callback for any state changes

  // State management
  state = $state({
    grouping: [] as GroupConfig[],
    groupedData: [] as GroupedItem<T>[],
    pagination: { page: 1, perPage: 20, count: 1 } as Pagination, // Initializes pagination settings, enabling straightforward data navigation
    status: { isFetching: false, isError: false, isRefetching: false }, // Tracks data fetching status for user feedback
    processedData: [] as T[],
    sortingArray: [] as Sorting[], // Stores current sorting criteria for easy reference
    filters: [] as Filter[], // Holds active filters to apply to the data
    expandedRows: [] as ExpandedRows, // Manages which rows are expanded for better user experience
    selectedRows: [] as T[], // Keeps track of user-selected rows for operations
    isFullscreenActive: false, // State for tracking fullscreen mode status
    isHeadFilterVisible: false, // State for managing visibility of header filters
  });

  // Internal state management
  internal = $state({
    selectionState: {
      start: null, // Starting index for selection, allowing for range selection
      end: null, // Ending index for selection
      range: new SvelteSet(), // Set to manage unique selections
      activeRange: new SvelteSet(), // Set for the currently active selection range
      isSelecting: false, // Indicates if the user is in the process of selecting
      isRemoving: false, // Indicates if selection is being removed
      isMouseDown: false // Tracks mouse state during selection actions
    } as SelectionState,
    keyboardNavigation: { focusedRowIndex: 0, focusedColumnIndex: 0 }, // Supports keyboard navigation, enhancing accessibility
    selectedRowIds: new SvelteSet<number>(), // Stores IDs of selected rows for quick reference
    headSize: -1, // Allows for header size adjustments as necessary
  });

  // Configuration options for additional features
  options = $state(this.getDefaultOptions());

  /**
   * Constructs a new TzezarDatagrid instance and initializes it with the provided configuration.
   * 
   * @param config - Configuration object for initializing the datagrid.
   */
  constructor(config: TzezarDatagridConfig<T, C>) {
    this.initializeFromConfig(config); // Initialize core properties and event handlers
    this.initializeData(); // Process the initial data set for display
  }

  private getDefaultOptions() {
    return {
      defaultColumnWidth: '200px',
      paginate: true,
      sortable: true,
      scrollable: true,
      fullscreenMode: { enabled: true },
      pagination: { display: true },
      dataIndicator: { display: true },
      statusIndicator: { display: true },
      rows: { striped: true },
      exportFileName: 'data',
      topbar: {
        display: false,
        displayFullscreenToggle: false,
        displayExportDataMenu: false,
        displayCopyDataMenu: false,
        displayHeadFilterToggle: false,
        settingsMenu: {
          display: false,
          displaySortingMenu: true,
          displayReorderingMenu: true,
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
      } as SpacingConfig,
      fontSize: {
        options: {
          xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.5rem',
        },
        selected: { label: 'md', value: '1rem' }
      } as FontSize
    };
  }

  // Initialize the datagrid with the provided configuration
  private initializeFromConfig(config: TzezarDatagridConfig<T, C>) {
    const { mode, columns, data, identifier, title, options, state, onPageChange, onPerPageChange, onSortingChange, onFiltersChange, onChange } = config;

    // Set core properties, ensuring defaults are respected
    this.mode = mode || this.mode; // Fallback to default mode if not provided
    // Apply offsets to columns for proper alignment
    // @ts-expect-error ts(2322) 
    this.columns = applyOffset(columns); // Ensure columns are properly aligned before display
    this.data = data; // Set the data for the grid
    this.identifier = identifier || this.identifier; // Use provided identifier or fallback to default
    this.title = title || this.title; // Set the title of the grid

    // Set event handlers, allowing for extensibility
    this.onPageChange = onPageChange || this.onPageChange;
    this.onPerPageChange = onPerPageChange || this.onPerPageChange;
    this.onSortingChange = onSortingChange || this.onSortingChange;
    this.onFiltersChange = onFiltersChange || this.onFiltersChange;
    this.onChange = onChange || this.onChange;

    // Initialize state from the provided configuration
    this.initializeState(state);

    // Initialize additional options as specified
    if (options) {
      this.updateOptions(options);
    }
  }
  updateOptions(newOptions: DeepPartial<ReturnType<TzezarDatagrid<T, C>['getDefaultOptions']>>) {
    this.options = deepMerge(this.options, newOptions);
    this.onChange();
  }
  // Initialize state with provided values or defaults
  private initializeState(state?: Partial<typeof this.state>) {
    if (state) {
      Object.assign(this.state, state); // Merge provided state values with existing state
    }
  }

  // Initialize options with provided values or defaults
  private initializeOptions(options?: Partial<typeof this.options>) {
    if (options) {
      Object.assign(this.options, options); // Merge provided options with existing configuration
    }
  }
  private calculateAggregates(items: T[], aggregations: AggregationConfig[]): Aggregates {
    const results: Aggregates = [];

    for (const agg of aggregations) {

      // const values = items.map(item => Number(item[agg.field])).filter(val => !isNaN(val));
      const values = items.map(item => item[agg.field as keyof T] as number);


      if (agg.type === 'sum') {
        const sum = values.reduce((a, b) => a + b, 0);
        results.push({ type: 'sum', field: agg.field, value: sum, label: agg.label });
      } else if (agg.type === 'avg') {
        const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        results.push({ type: 'avg', field: agg.field, value: avg, label: agg.label });
      } else if (agg.type === 'min') {
        const min = values.length ? Math.min(...values) : 0;
        results.push({ type: 'min', field: agg.field, value: min, label: agg.label });
      } else if (agg.type === 'max') {
        const max = values.length ? Math.max(...values) : 0;
        results.push({ type: 'max', field: agg.field, value: max, label: agg.label });
      } else if (agg.type === 'count') {
        const count = values.length;
        results.push({ type: 'count', field: agg.field, value: count, label: agg.label });
      }
    }

    return results;
  }
  // Initialize data by sorting, filtering, and paginating it as per current state
  private initializeData() {
    this.updateProcessedData()
  }


  private flattenGroupedData(groupedData: GroupedItem<T>[]): T[] {
    const result: T[] = [];

    for (const group of groupedData) {
      result.push(group as unknown as T);
      if (group.items && group.items.length > 0) {
        if (this.isGroupedItem(group.items[0])) {
          result.push(...this.flattenGroupedData(group.items as GroupedItem<T>[]));
        } else {
          result.push(...(group.items as T[]));
        }
      }
    }

    return result;
  }

  private isGroupedItem(item: any): item is GroupedItem<T> {
    return item && typeof item === 'object' && 'groupBy' in item && 'level' in item;
  }

  // New method to update grouping configuration
  updateGrouping(groupConfigs: GroupConfig[]) {
    this.state.grouping = groupConfigs;
    this.updateColumns(this.columns);
    this.updateProcessedData();
    this.onChange();
  }

  // New method to get aggregated values for a specific group
  getGroupAggregates(groupKey: any, groupField: keyof T): Record<string, number> | undefined {
    const findGroup = (groups: GroupedItem<T>[]): GroupedItem<T> | undefined => {
      for (const group of groups) {
        if (group.key === groupKey && group.groupBy === groupField) {
          return group;
        }
        if (group.items && this.isGroupedItem(group.items[0])) {
          const found = findGroup(group.items as GroupedItem<T>[]);
          if (found) return found;
        }
      }
      return undefined;
    };

    const group = findGroup(this.state.groupedData);
    return group?.aggregates;
  }

  private groupData(data: T[], level: number): GroupedItem<T>[] {
    if (level >= this.state.grouping.length) {
      return data as unknown as GroupedItem<T>[];
    }

    const groupConfig = this.state.grouping[level];
    const grouped: Record<string, GroupedItem<T>> = {};

    // Group the data
    for (const item of data) {
      const key = item[groupConfig.field];
      if (!grouped[key]) {
        grouped[key] = {
          key,
          groupBy: groupConfig.field,
          level,
          items: [],
          aggregates: {}
        };
      }
      grouped[key].items.push(item);
    }

    // Process each group
    for (const group of Object.values(grouped)) {
      // Calculate aggregates if configured
      if (groupConfig.aggregations && groupConfig.aggregations.length > 0) {
        group.aggregates = this.calculateAggregates(
          group.items as T[],
          groupConfig.aggregations
        );
      }

      // Recursively group the items
      group.items = this.groupData(group.items as T[], level + 1);
    }

    return Object.values(grouped);
  }
  updateProcessedData() {
    if (this.mode === 'client') {
      const filteredData = filterData([...this.data], this.state.filters);
      const sortedData = sortData(filteredData, this.state.sortingArray);

      if (this.options.grouping) {
        // Store the grouped data in state
        this.state.groupedData = this.groupData([...sortedData], 0);

        if (this.options.paginate) {
          // Convert grouped data to flat array for pagination
          const flattenedData = this.flattenGroupedData(this.state.groupedData);
          this.state.groupedData = paginateData(
            this.state.groupedData,
            this.state.pagination.page,
            this.state.pagination.perPage
          );
        }

        this.updateCount(this.state.groupedData);
      } else {
        if (this.options.paginate) {
          this.state.processedData = paginateData(
            sortedData,
            this.state.pagination.page,
            this.state.pagination.perPage
          );
        } else {
          this.state.processedData = sortedData;
        }
        this.updateCount(filteredData);
      }
    }
  }



  updateCount(data: T[]) {
    if (this.mode === 'client') {
      this.state.pagination.count = data.length || 1;
    }
  }

  // Public methods for external interaction
  updateData(newData: T[]) {
    this.data = newData; // Update the data displayed in the grid
    this.initializeData(); // Re-initialize data processing after updating
    this.onChange(); // Trigger any change handlers to notify observers
  }

  updateColumns(newColumns: C[]): C[] {
    // Create a copy of newColumns to avoid mutating the original array
    let columnsTemp = [...newColumns];

    // Apply offset to columns and cast the result back to C[]
    columnsTemp = applyOffset(columnsTemp) as C[];

    let lastGroupedIndex = -1; // Track the position for inserting grouped columns

    // If grouping is enabled, reorder the columns
    if (this.options.grouping) {
      this.state.grouping.forEach((group) => {
        // Find the index of the column corresponding to the groupBy key
        const index = columnsTemp.findIndex((column) => column.id === group.field);
        if (index === -1) return; // Skip if the column isn't found

        // Extract the column and mark it as grouped
        const [column] = columnsTemp.splice(index, 1);
        column.grouped = true;

        // Insert the grouped column right after the last grouped column
        lastGroupedIndex++;
        columnsTemp.splice(lastGroupedIndex, 0, column);
      });


      // Move the 'expand' column after the last grouped column
      const expandIndex = columnsTemp.findIndex((column) => column.id === 'expand');
      if (expandIndex !== -1) {
        // Extract the 'expand' column
        const [expandColumn] = columnsTemp.splice(expandIndex, 1);

        // Insert the 'expand' column after the last grouped column
        lastGroupedIndex++;
        columnsTemp.splice(lastGroupedIndex, 0, expandColumn);
      }
    }



    return columnsTemp;
  }

  updatePagination(page: number, perPage: number) {
    // Update pagination state and trigger callbacks
    this.state.pagination.page = page;
    this.state.pagination.perPage = perPage;
    this.updateProcessedData()

    this.onPageChange();
    this.onPerPageChange();
    this.onChange();
  }

  updateSorting(newSorting: Sorting[]) {
    // Update sorting state and trigger callbacks
    this.state.sortingArray = newSorting;
    this.updateProcessedData()

    this.onSortingChange();
    this.onChange();
  }

  updateFilters(newFilters: Filter[]) {
    this.state.filters = newFilters;
    this.state.pagination.page = 1;
    this.updateProcessedData()

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
  options?: DeepPartial<ReturnType<TzezarDatagrid<T, C>['getDefaultOptions']>>;
  state?: Partial<TzezarDatagrid<T, C>['state']>;
  onPageChange?: () => void;
  onPerPageChange?: () => void;
  onSortingChange?: () => void;
  onFiltersChange?: () => void;
  onChange?: () => void;
};

export type TopBarOptions = DeepPartial<ReturnType<TzezarDatagrid<unknown>['getDefaultOptions']>>['topbar']