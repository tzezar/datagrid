import { RowSelectionFeature } from "$lib/datagrid/core/features";
import type { RowSelectionFeatureConfig } from "$lib/datagrid/core/features/row-selection.svelte";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";
import type { GridRowIdentifier } from "$lib/datagrid/core/types";
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
    rowSelectionMode: 'single' | 'multiple' = $state('multiple');
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

    toggleRowSelection(identifier: GridRowIdentifier) {
        const isRowSelected = this.base.isRowSelected(identifier);
        if (isRowSelected) {
            this.unselectRow(identifier);
            return
        }
        
        const isSelectingMoreThanAllowed = this.base.maxSelectedRows !== undefined && this.base.selectedBasicRowIdentifiers.size >= this.base.maxSelectedRows;
        if (isSelectingMoreThanAllowed) {
            console.log('selecting more than allowed')
            return
        }
        
    }

    selectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.base.clearSelection()
            this.base.selectRow(identifier);
            return
        }

        const isMaxSelectedRowsReached = this.base.maxSelectedRows !== undefined && this.base.selectedBasicRowIdentifiers.size >= this.base.maxSelectedRows;
        if (isMaxSelectedRowsReached) {
            console.log('selecting more than allowed')
            return
        }

        this.base.selectRow(identifier);
    }

    unselectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.base.clearSelection()
            return
        }

        this.base.unselectRow(identifier);
    }


}