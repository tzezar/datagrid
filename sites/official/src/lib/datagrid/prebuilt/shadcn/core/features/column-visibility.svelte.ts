import { ColumnVisibilityFeature } from "$lib/datagrid/core/features";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";



export type ExtraColumnVisibilityFeatureConfig = {
    enableColumnVisibility?: boolean;
    onColumnVisibilityChange?(hiddenColumns: string[]): void;
}


export class ExtraColumnVisibilityFeature {
    base: ColumnVisibilityFeature<any> = new ColumnVisibilityFeature<any>({} as DataGrid<any>); 

    enableColumnVisibility: boolean = $state(true);
    onColumnVisibilityChange: (hiddenColumns: string[]) => void = () => { };
    constructor(datagrid: DataGrid<any>, config?: ExtraColumnVisibilityFeatureConfig) {
        this.base = new ColumnVisibilityFeature(datagrid);

        if (config) {
            this.enableColumnVisibility = config.enableColumnVisibility ?? this.enableColumnVisibility;
            this.onColumnVisibilityChange = config.onColumnVisibilityChange ?? this.onColumnVisibilityChange;
        }
    }
}