import { RowExpandingFeature } from "$lib/datagrid/core/features";
import type { RowExpandingFeatureConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import { TzezarsDatagrid } from "../index.svelte";


export type ExtraRowExpandingFeatureConfig = {
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    expandingPosition?: 'left' | 'right';
    maxExpandedRows?: number;
} & RowExpandingFeatureConfig


export class ExtraRowExpandingFeature {
    base: RowExpandingFeature<any> = new RowExpandingFeature<any>({} as DataGrid<any>);
    enableRowExpanding: boolean = $state(true);
    expandingMode: 'single' | 'multiple' = $state('single');
    expandingPosition: 'left' | 'right' = $state('left');
    maxExpandedRows: number = $state(999999999);

    constructor(datagrid: TzezarsDatagrid<any>, config?: ExtraRowExpandingFeatureConfig & RowExpandingFeatureConfig) {
        this.base = datagrid.features.rowExpanding;
        this.base.initialize(config);

        if (config) {
            this.enableRowExpanding = config.enableRowExpanding ?? this.enableRowExpanding;
            this.expandingMode = config.expandingMode ?? this.expandingMode;
            this.expandingPosition = config.expandingPosition ?? this.expandingPosition;
            this.maxExpandedRows = config.maxExpandedRows ?? this.maxExpandedRows;
        }
    }
    
}