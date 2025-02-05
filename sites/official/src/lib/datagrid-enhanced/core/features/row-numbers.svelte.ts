import type { EnhancedDatagrid } from "../index.svelte";
import type { Feature } from "./types";


export type RowNumbersFeatureConfig = {
    enableRowNumbers?: boolean;
    rowNumberMode?: 'original' | 'static';
}

export class RowNumbersFeature implements Feature {
    datagrid: EnhancedDatagrid;
    enableRowNumbers: boolean = $state(true);
    rowNumberMode: 'original' | 'static' = $state('static');

    constructor(datagrid: EnhancedDatagrid, config?: RowNumbersFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: RowNumbersFeatureConfig) {
        this.enableRowNumbers = config?.enableRowNumbers ?? this.enableRowNumbers;
        this.rowNumberMode = config?.rowNumberMode ?? this.rowNumberMode;
    }

}