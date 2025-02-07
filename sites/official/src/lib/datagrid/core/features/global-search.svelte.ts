import Fuse from "fuse.js";


export type GlobalSearchState = {
    manual: boolean;
    value: string;
    fuzzy: boolean;
    delay: number;
    fuseInstance: Fuse<any> | null;

}

export type GlobalSearchFeatureConfig = Partial<GlobalSearchState>;
export type IGlobalSearchState = GlobalSearchState


export class GlobalSearchFeature implements IGlobalSearchState {
    manual: boolean = $state(false);
    value = $state('');
    delay = $state(300);
    fuzzy = $state(true);
    fuseInstance: Fuse<any> | null = $state(null)

    onGlobalSearchChange: (value: string) => void = () => { };

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
}
