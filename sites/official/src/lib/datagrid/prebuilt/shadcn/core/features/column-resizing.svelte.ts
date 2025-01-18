import { ColumnSizingFeature } from "$lib/datagrid/core/features";
import type { ColumnSizingFeatureConfig } from "$lib/datagrid/core/features/column-sizing.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraColumnSizingFeatureConfig = {
    enableColumnSizing?: boolean;
    columnResizeMode?: 'standard' | 'fluid';
} & ColumnSizingFeatureConfig


export class ExtraColumnSizingFeature {
    base: ColumnSizingFeature<any> = new ColumnSizingFeature<any>({} as DataGrid<any>);
    enableColumnSizing: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(datagrid: DataGrid<any>, config?: ExtraColumnSizingFeatureConfig) {
        this.base = datagrid.features.columnSizing;
        this.base.initialize(config);

        if (config) {
            this.enableColumnSizing = config.enableColumnSizing ?? this.enableColumnSizing;
            this.columnResizeMode = config.columnResizeMode ?? this.columnResizeMode;
        }
    }
}