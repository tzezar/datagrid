import { RowSelectionFeature } from "$lib/datagrid/core/features";
import type { GridRowIdentifier } from "$lib/datagrid/core/types";
import type { TzezarsDatagrid } from "../index.svelte";
import type { EnchancedFeature } from "./types";


export type RowSelectionEnchancedFeatureConfig = {

    displayBuiltInComponents?: boolean;
    rowSelectionMode?: 'single' | 'multiple';
    enableSelectAll?: boolean;
    highlightSelectedRow?: boolean;
    position?: 'left' | "right" | 'none'

    onSelectMoreThanMaxSelectedRows?(): void;
    onRowSelectionChange?(): void;
}

export class RowSelectionEnchancedFeature implements EnchancedFeature {
    datagrid: TzezarsDatagrid

    displayBuiltInComponents: boolean = $state(true);
    
    rowSelectionMode: 'single' | 'multiple' = $state('multiple');
    enableSelectAll: boolean = $state(true);
    highlightSelectedRow: boolean = $state(true);
    position: "left" | "right" | 'none' = $state('right')

    onSelectMoreThanMaxSelectedRows: () => void = () => { }
    onRowSelectionChange: () => void = () => { }


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
        this.onSelectMoreThanMaxSelectedRows = config?.onSelectMoreThanMaxSelectedRows ?? this.onSelectMoreThanMaxSelectedRows
        this.onRowSelectionChange = config?.onRowSelectionChange ?? this.onRowSelectionChange
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

            this.onRowSelectionChange()
            return
        }

        const isMaxSelectedRowsReached = this.base.maxSelectedRows !== undefined && this.base.selectedBasicRowIdentifiers.size >= this.base.maxSelectedRows;
        if (isMaxSelectedRowsReached) {
            this.onSelectMoreThanMaxSelectedRows();
            return
        }

        this.base.selectRow(identifier);
        this.onRowSelectionChange()
    }

    unselectRow(identifier: GridRowIdentifier) {
        if (this.rowSelectionMode === 'single') {
            this.base.clearSelection()


            return
        }

        this.base.unselectRow(identifier);
    }


}