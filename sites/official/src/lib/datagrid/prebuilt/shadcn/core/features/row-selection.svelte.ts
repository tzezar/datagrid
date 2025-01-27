import { RowSelectionFeature } from "$lib/datagrid/core/features";
import type { RowSelectionFeatureConfig } from "$lib/datagrid/core/features/row-selection.svelte";
import type { GridRowIdentifier } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


export type RowSelectionEnchancedFeatureConfig = {

    displayBuiltInComponents?: boolean;
    rowSelectionMode?: 'single' | 'multiple';
    enableSelectAll?: boolean;
    highlightSelectedRow?: boolean;
    position?: 'left' | "right" | 'none'
} & RowSelectionFeatureConfig

export class RowSelectionEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    displayBuiltInComponents: boolean = $state(true);
    
    rowSelectionMode: 'single' | 'multiple' = $state('multiple');
    enableSelectAll: boolean = $state(true);
    highlightSelectedRow: boolean = $state(true);
    position: "left" | "right" | 'none' = $state('right')

    get base(): RowSelectionFeature { return this.datagrid.features.rowSelection }

    constructor(datagrid: TzezarsDatagrid<any>, config?: RowSelectionEnchancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    initialize(config?: RowSelectionEnchancedFeatureConfig) {
        this.displayBuiltInComponents = config?.displayBuiltInComponents ?? this.displayBuiltInComponents;
        this.rowSelectionMode = config?.rowSelectionMode ?? this.rowSelectionMode;
        this.enableSelectAll = config?.enableSelectAll ?? this.enableSelectAll;
        this.highlightSelectedRow = config?.highlightSelectedRow ?? this.highlightSelectedRow;
        this.position = config?.position ?? this.position
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