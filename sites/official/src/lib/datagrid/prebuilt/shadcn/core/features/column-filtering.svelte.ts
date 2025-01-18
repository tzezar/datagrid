

export type ColumnFilteringFeatureConfig = {
    onColumnFilteringChange?(filteredColumns: string[]): void;
    enabled?: boolean;
}


export class ColumnFilteringFeature {
    onColumnFilteringChange?: (filteredColumns: string[]) => void
    enabled: boolean = $state(false);

    constructor(config?: ColumnFilteringFeatureConfig) {
        if (config) {
            this.enabled = config.enabled ?? this.enabled;
            this.onColumnFilteringChange = config.onColumnFilteringChange ?? this.onColumnFilteringChange;
        }
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