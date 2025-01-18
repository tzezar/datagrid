import { ColumnPinningFeature } from "$lib/datagrid/core/features";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";


export type ExtraColumnPinningFeatureConfig = {
    enableColumnPinning?: boolean;
    onColumnPinningChange?(pinnedColumns: string[]): void;
}

export class ExtraColumnPinningFeature {
    base: ColumnPinningFeature = new ColumnPinningFeature({} as DataGrid<any>);
    enableColumnPinning: boolean = $state(true);
    onColumnPinningChange: (pinnedColumns: string[]) => void = () => { };
    
    constructor(datagrid: DataGrid<any>, config?: ExtraColumnPinningFeatureConfig) {
        this.base = new ColumnPinningFeature(datagrid);

        if (config) {
            this.enableColumnPinning = config.enableColumnPinning ?? this.enableColumnPinning;
            this.onColumnPinningChange = config.onColumnPinningChange ?? this.onColumnPinningChange;
        }
    }
}