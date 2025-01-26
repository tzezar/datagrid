import { ColumnSizingFeature } from "$lib/datagrid/core/features";
import type { ColumnSizingFeatureConfig } from "$lib/datagrid/core/features/column-sizing.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnSizingEnchancedFeatureConfig = {
    enabled?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
} & ColumnSizingFeatureConfig

export class ColumnSizingEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    enabled: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: ColumnSizingEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    get base(): ColumnSizingFeature { return this.datagrid.features.columnSizing }

    initialize(config?: ColumnSizingEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
        this.columnResizeMode = config?.columnResizeMode ?? this.columnResizeMode;
    }

}