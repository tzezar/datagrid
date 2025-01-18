import { ColumnFilteringFeature } from "$lib/datagrid/core/features";
import type { ColumnFilteringFeatureConfig } from "$lib/datagrid/core/features/column-filtering.svelte";
import type { TzezarsDatagrid } from "../index.svelte";


export type ExtraColumnFilteringFeatureConfig = {
    onColumnFilteringChange?(filteredColumns: string[]): void;
    enabled?: boolean;
}


export class ExtraColumnFilteringFeature {
    base: ColumnFilteringFeature<any> = new ColumnFilteringFeature()
    onColumnFilteringChange?: (filteredColumns: string[]) => void
    enabled: boolean = $state(false);

    constructor(datagrid: TzezarsDatagrid, config?: ExtraColumnFilteringFeatureConfig & ColumnFilteringFeatureConfig) {
        this.base = new ColumnFilteringFeature(config);
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