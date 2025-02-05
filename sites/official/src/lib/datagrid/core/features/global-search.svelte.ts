import Fuse from "fuse.js";


export type GlobalSearchPluginConfig = {
    manual?: boolean;
    value?: string;
    delay?: number;
    fuzzy?: boolean;
    fuseInstance?: Fuse<any>;
    onGlobalSearchChange?(value: string): void;
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
    fuseInstance: Fuse<any> | null = $state(null)

    onGlobalSearchChange: (value: string) => void = () => { };

    constructor(config?: GlobalSearchPluginConfig) {
        this.initialize(config);
    }

    initialize(config?: GlobalSearchPluginConfig) {
        this.manual = config?.manual ?? this.manual;
        this.value = config?.value ?? this.value;
        this.delay = config?.delay ?? this.delay;
        this.fuzzy = config?.fuzzy ?? this.fuzzy;
        this.fuseInstance = config?.fuseInstance ?? this.fuseInstance;
        this.onGlobalSearchChange = config?.onGlobalSearchChange ?? this.onGlobalSearchChange;
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
}
