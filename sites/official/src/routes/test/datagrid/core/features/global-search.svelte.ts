import type Fuse from "fuse.js";

export class GlobalSearch {


    value = $state('Dixie');
    delay = $state(300);
    fuzzy = $state(false);
    fuseInstance: Fuse<any> | null = null;

    setFuseInstance(fuseInstance: Fuse<any> | null) {
        this.fuseInstance = fuseInstance;
    }

    updateSearchValue(value: string) {
        this.value = value;
    }

}