import Fuse, { type IFuseOptions } from "fuse.js";
import type { DatagridCore } from "../index.svelte";
import { DEFAULT_FUSE_OPTIONS } from "../defaults";


export type GlobalSearchState = {
    isManual: boolean;
    searchQuery: string;
    isFuzzySearchEnabled: boolean;
    debounceDelay: number;
    fuseSearchEngine: Fuse<any> | null;

}

export type GlobalSearchFeatureConfig = Partial<GlobalSearchState>;
export type IGlobalSearchState = GlobalSearchState


export class GlobalSearchFeature implements IGlobalSearchState {
    datagrid: DatagridCore

    isManual: boolean = $state(false);
    searchQuery = $state('');
    debounceDelay = $state(300);
    isFuzzySearchEnabled = $state(true);
    fuseSearchEngine: Fuse<any> | null = $state(null)

    onSearchQueryChange: (value: string) => void = () => { };

    constructor(datagrid: DatagridCore, config: GlobalSearchFeatureConfig) {
        this.datagrid = datagrid
        Object.assign(this, config);
    }


    updateSearchQuery(query: string): void {
        this.datagrid.events.emit('onSearchQueryChange', { prevQuery: this.searchQuery, newQuery: query });
        this.searchQuery = query;
        if (this.fuseSearchEngine && query) {
            this.fuseSearchEngine.search(query);
            // Handle the results (e.g., update state, display results)
        }
    }

    /**
     * Initializes a new Fuse.js instance with the provided items and search keys.
     * This is used to set up the search functionality for the given data.
     * @param items - The array of items to search through.
     * @param keys - The keys within each item to search on.
     * @returns The initialized Fuse.js instance configured with search options.
     */
    initializeFuseInstance<T>(items: T[], keys: string[], config: IFuseOptions<T> = DEFAULT_FUSE_OPTIONS): Fuse<T> {
        // Configure Fuse.js options to perform fuzzy search
        return new Fuse(items, {
            keys,               // Specify which fields to search on
            ...config,          // Merge default options with provided options
        });
    }

    getFuseSearchEngine(): Fuse<any> | null {
        if (!this.fuseSearchEngine) {
            this.setFuseSearchEngine(this.initializeFuseInstance(this.datagrid.originalState.data || [], this.datagrid.columns.getFlattenedColumnStructure().map(col => col.columnId as string)))
        }
        return this.fuseSearchEngine;
    }


    setFuseSearchEngine(fuseSearchEngine: Fuse<any> | null): void {
        this.fuseSearchEngine = fuseSearchEngine;
    }



}
