import { RowSelectionFeature } from "$lib/datagrid/core/features";
import type { RowSelectionFeatureConfig } from "$lib/datagrid/core/features/row-selection.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { TzezarsDatagrid } from "../index.svelte";


export type ExtraRowSelectionFeatureConfig = {
    enableRowSelection?: boolean;
    enableMultiRowSelection?: boolean;
    rowSelectionMode?: 'single' | 'multiple';
    enableSelectAll?: boolean;
    highlightSelectedRow?: boolean;
} & RowSelectionFeatureConfig

export class ExtraRowSelectionFeature {
    public base: RowSelectionFeature<any> = new RowSelectionFeature<any>({} as DataGrid<any>);

    enableRowSelection: boolean = $state(true);
    enableMultiRowSelection: boolean = $state(true);
    rowSelectionMode: 'single' | 'multiple' = $state('single');
    enableSelectAll: boolean = $state(true);
    highlightSelectedRow: boolean = $state(true);


    constructor(datagrid: TzezarsDatagrid<any>, config?: ExtraRowSelectionFeatureConfig) {
        this.base = datagrid.features.rowSelection;
        this.base.initialize(config);

        if (config) {
            this.enableRowSelection = config.enableRowSelection ?? this.enableRowSelection;
            this.enableMultiRowSelection = config.enableMultiRowSelection ?? this.enableMultiRowSelection;
            this.rowSelectionMode = config.rowSelectionMode ?? this.rowSelectionMode;
            this.enableSelectAll = config.enableSelectAll ?? this.enableSelectAll;
            this.highlightSelectedRow = config.highlightSelectedRow ?? this.highlightSelectedRow;
        }
    }

}