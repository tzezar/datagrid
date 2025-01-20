import { ColumnSizingFeature } from "$lib/datagrid/core/features";
import type { ColumnSizingFeatureConfig } from "$lib/datagrid/core/features/column-sizing.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { EnchancedFeature } from "./types";

export type ColumnSizingEnchancedFeatureConfig = {
    enabled?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
} & ColumnSizingFeatureConfig

export class ColumnSizingEnchancedFeature implements EnchancedFeature {
    base: ColumnSizingFeature<any> = new ColumnSizingFeature<any>({} as DataGrid<any>);
    enabled: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(datagrid: DataGrid<any>, config?: ColumnSizingEnchancedFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: ColumnSizingEnchancedFeatureConfig) {
        this.enabled = config?.enabled ?? this.enabled;
        this.columnResizeMode = config?.columnResizeMode ?? this.columnResizeMode;
    }

    initializeBase(datagrid: DataGrid<any>, config?: ColumnSizingFeatureConfig) {
        this.base = datagrid.features.columnSizing;
        this.base.initialize(config);
    }

}