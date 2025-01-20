import { RowExpandingFeature } from "$lib/datagrid/core/features";
import type { RowExpandingFeatureConfig } from "$lib/datagrid/core/features/row-expanding.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


const DEFAULT_MAX_EXPANDED_ROWS = 999999999;

export type RowExpandingEnchancedFeatureConfig = {
    enableRowExpanding?: boolean;
    expandingMode?: 'single' | 'multiple';
    expandingPosition?: 'left' | 'right';
    maxExpandedRows?: number;
} & RowExpandingFeatureConfig


export class RowExpandingEnchancedFeature implements EnchancedFeature {
    base: RowExpandingFeature = new RowExpandingFeature<any>({} as DataGrid);
    enableRowExpanding: boolean = $state(true);
    expandingMode: 'single' | 'multiple' = $state('single');
    expandingPosition: 'left' | 'right' = $state('left');
    maxExpandedRows: number = $state(DEFAULT_MAX_EXPANDED_ROWS);

    constructor(datagrid: TzezarsDatagrid, config?: RowExpandingEnchancedFeatureConfig & RowExpandingFeatureConfig) {
        this.initializeBase(datagrid, config);
        this.initialize(config);
    }

    initialize(config?: RowExpandingEnchancedFeatureConfig) {
        this.enableRowExpanding = config?.enableRowExpanding ?? this.enableRowExpanding;
        this.expandingMode = config?.expandingMode ?? this.expandingMode;
        this.expandingPosition = config?.expandingPosition ?? this.expandingPosition;
        this.maxExpandedRows = config?.maxExpandedRows ?? this.maxExpandedRows;
    }

    initializeBase(datagrid: TzezarsDatagrid<any>, config?: RowExpandingFeatureConfig) {
        this.base = datagrid.features.rowExpanding;
        this.base.initialize(config);
    }

}