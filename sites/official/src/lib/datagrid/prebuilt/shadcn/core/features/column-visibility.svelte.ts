import { ColumnVisibilityFeature } from "$lib/datagrid/core/features";
import type { ColumnVisibilityFeatureConfig } from "$lib/datagrid/core/features/column-visibility.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";



export type ExtraColumnVisibilityFeatureConfig = {
    enableColumnVisibility?: boolean;
} & ColumnVisibilityFeatureConfig


export class ExtraColumnVisibilityFeature {
    base: ColumnVisibilityFeature<any> = new ColumnVisibilityFeature<any>({} as DataGrid<any>); 

    enableColumnVisibility: boolean = $state(true);
    constructor(datagrid: DataGrid<any>, config?: ExtraColumnVisibilityFeatureConfig) {
        this.base = datagrid.features.columnVisibility;
        this.base.initialize(config);

        if (config) {
            this.enableColumnVisibility = config.enableColumnVisibility ?? this.enableColumnVisibility;
        }
    }
}