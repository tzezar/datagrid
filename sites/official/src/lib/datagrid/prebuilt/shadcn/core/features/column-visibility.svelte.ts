import type { ColumnVisibilityFeature, ColumnVisibilityFeatureConfig } from "$lib/datagrid/core/features/column-visibility.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnVisibilityEnchancedFeatureConfig = {
    displayControlCenterControls?: boolean;
    displayInColumnDropdown?: boolean;
} & ColumnVisibilityFeatureConfig

export class ColumnVisibilityEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    displayControlCenterControls: boolean = $state(true);
    displayInColumnDropdown: boolean = $state(true);

    constructor(datagrid: TzezarsDatagrid, config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnVisibilityFeature { return this.datagrid.features.columnVisibility }

    initialize(config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.displayControlCenterControls = config?.displayControlCenterControls ?? this.displayControlCenterControls;
        this.displayInColumnDropdown = config?.displayInColumnDropdown ?? this.displayInColumnDropdown;
    }

}