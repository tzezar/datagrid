


export class ColumnFilteringFeature {
    onColumnFilteringChange?: (filteredColumns: string[]) => void
    enabled: boolean = $state(false);

    constructor() {
    }

    enableColumnFiltering() {
        this.enabled = true;
    }

    disableColumnFiltering() {
        this.enabled = false;
    }

    toggleColumnFiltering() {
        this.enabled = !this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }


}