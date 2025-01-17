import Fuse, { type IFuseOptions } from "fuse.js";
import { DEFAULT_FUSE_OPTIONS } from "../defaults";


export type GlobalSearchFeatureConfig = {
    manual: boolean;
    value?: string;
    delay?: number;
    fuzzy?: boolean;
    fuseInstance?: Fuse<any>;
}


/**
 * Manages global search functionality with fuzzy searching using Fuse.js.
 */
export class GlobalSearchFeature {
    manual: boolean = $state(false);

    // State for storing the current search value
    value = $state('');

    // State for the search debounce delay (in milliseconds)
    delay = $state(300);

    // State for toggling fuzzy search behavior
    fuzzy = $state(true);

    // The instance of Fuse.js for performing the search
    fuseInstance: Fuse<any> | null = null;

    constructor(config?: GlobalSearchFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: GlobalSearchFeatureConfig) {
        this.manual = config?.manual ?? this.manual;
        this.value = config?.value ?? this.value;
        this.delay = config?.delay ?? this.delay;
        this.fuzzy = config?.fuzzy ?? this.fuzzy;
        this.fuseInstance = config?.fuseInstance ?? this.fuseInstance;
    }

    /**
     * Sets the Fuse.js instance used for performing searches.
     * @param fuseInstance - The Fuse.js instance to use for searching.
     */
    setFuseInstance(fuseInstance: Fuse<any> | null): void {
        this.fuseInstance = fuseInstance;
    }

    /**
     * Updates the current search value.
     * @param value - The new search value to set.
     */
    updateSearchValue(value: string): void {
        this.value = value;
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
}
