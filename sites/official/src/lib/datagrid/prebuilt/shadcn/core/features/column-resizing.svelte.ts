import { ColumnSizingFeature } from "$lib/datagrid/core/features";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraColumnSizingFeatureConfig = {
    enableColumnSizing?: boolean;
    onColumnResize?(columnId: string, width: number): void;
    columnResizeMode?: 'standard' | 'fluid';
}


export class ExtraColumnSizingFeature {
    base: ColumnSizingFeature<any> = new ColumnSizingFeature<any>({} as DataGrid<any>);
    enableColumnSizing: boolean = $state(true);
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move

    onColumnResize: (columnId: string, width: number) => void = () => { };

    constructor(datagrid: DataGrid<any>, config?: ExtraColumnSizingFeatureConfig) {
        this.base = new ColumnSizingFeature(datagrid);

        if (config) {
            this.enableColumnSizing = config.enableColumnSizing ?? this.enableColumnSizing;
            this.onColumnResize = config.onColumnResize ?? this.onColumnResize;
            this.columnResizeMode = config.columnResizeMode ?? this.columnResizeMode;
        }
    }
}