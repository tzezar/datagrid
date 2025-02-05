import type { ColumnVisibilityFeature } from "$lib/datagrid/core/features/column-visibility.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";

export type ColumnVisibilityEnhancedFeatureConfig = {
    displayControlCenterControls?: boolean;
    displayInColumnDropdown?: boolean;
} 

export class ColumnVisibilityEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid

    displayControlCenterControls: boolean = $state(true);
    displayInColumnDropdown: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnVisibilityEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnVisibilityFeature { return this.datagrid.features.columnVisibility }

    initialize(config?: ColumnVisibilityEnhancedFeatureConfig) {
        this.displayControlCenterControls = config?.displayControlCenterControls ?? this.displayControlCenterControls;
        this.displayInColumnDropdown = config?.displayInColumnDropdown ?? this.displayInColumnDropdown;
    }

}