import { RowSelectionFeature } from "$lib/datagrid/core/features";
import type { GridRowIdentifier } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnhancedFeature } from "./types";


export type RowSelectionEnhancedFeatureConfig = {

    displayBuiltInComponents?: boolean;
    rowSelectionMode?: 'single' | 'multiple';
    enableSelectAll?: boolean;
    highlightSelectedRow?: boolean;
    position?: 'left' | "right" | 'none'

    onSelectMoreThanMaxSelectedRows?(): void;
}

export class RowSelectionEnhancedFeature implements EnhancedFeature {
    datagrid: TzezarsDatagrid

    displayBuiltInComponents: boolean = $state(true);
    
    rowSelectionMode: 'single' | 'multiple' = $state('multiple');
    enableSelectAll: boolean = $state(true);
    highlightSelectedRow: boolean = $state(true);
    position: "left" | "right" | 'none' = $state('right')

    onSelectMoreThanMaxSelectedRows: () => void = () => { }


    get base(): RowSelectionFeature { return this.datagrid.features.rowSelection }

    constructor(datagrid: TzezarsDatagrid<any>, config?: RowSelectionEnhancedFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config);
    }

    initialize(config?: RowSelectionEnhancedFeatureConfig) {
        this.displayBuiltInComponents = config?.displayBuiltInComponents ?? this.displayBuiltInComponents;
        this.rowSelectionMode = config?.rowSelectionMode ?? this.rowSelectionMode;
        this.enableSelectAll = config?.enableSelectAll ?? this.enableSelectAll;
        this.highlightSelectedRow = config?.highlightSelectedRow ?? this.highlightSelectedRow;
        this.position = config?.position ?? this.position
        this.onSelectMoreThanMaxSelectedRows = config?.onSelectMoreThanMaxSelectedRows ?? this.onSelectMoreThanMaxSelectedRows
    }

    selectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.base.clearSelection()
            this.base.selectRow(identifier);
            this.base.onRowSelectionChange()
            return
        }

        const isMaxSelectedRowsReached = this.base.maxSelectedRows !== undefined && this.base.selectedBasicRowIdentifiers.size >= this.base.maxSelectedRows;
        if (isMaxSelectedRowsReached) {
            this.onSelectMoreThanMaxSelectedRows();
            return
        }

        this.base.selectRow(identifier);
        this.base.onRowSelectionChange()
    }

    unselectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.base.clearSelection()


            return
        }

        this.base.unselectRow(identifier);
    }


}