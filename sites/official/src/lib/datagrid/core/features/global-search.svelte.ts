import Fuse from "fuse.js";

export class GlobalSearchFeature {

    value = $state('');
    delay = $state(300);
    fuzzy = $state(true);
    fuseInstance: Fuse<any> | null = null;

    setFuseInstance(fuseInstance: Fuse<any> | null) {
        this.fuseInstance = fuseInstance;
    }

    updateSearchValue(value: string) {
        this.value = value;
    }

    initializeFuseInstance<T>(items: T[], keys: string[]): Fuse<T> {
        return new Fuse(items, {
            keys,
            threshold: 0.3,
            location: 0,
            distance: 100,
            includeScore: true,
            useExtendedSearch: true,
            ignoreLocation: true,
            findAllMatches: true,
        });
    }
    
}