import { ColumnVisibilityFeature } from "$lib/datagrid/core/features";
import type { ColumnVisibilityFeatureConfig } from "$lib/datagrid/core/features/column-visibility.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnVisibilityEnchancedFeatureConfig = {
    enabled?: boolean;
} & ColumnVisibilityFeatureConfig

export class ColumnVisibilityEnchancedFeature implements EnchancedFeature {
    base: ColumnVisibilityFeature<any> = new ColumnVisibilityFeature<any>({} as DataGrid<any>);
    enabled: boolean = $state(true);

    constructor(datagrid: DataGrid<any>, config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: ColumnVisibilityEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    initializeBase(datagrid: DataGrid<any>, config?: ColumnVisibilityFeatureConfig) {
        this.base = datagrid.features.columnVisibility;
        this.base.initialize(config);
    }
}