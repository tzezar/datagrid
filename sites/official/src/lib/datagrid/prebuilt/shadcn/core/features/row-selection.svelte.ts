import { RowSelectionFeature } from "$lib/datagrid/core/features";


export class ExtraRowSelectionFeature extends RowSelectionFeature<any> {
    enableRowSelection: boolean = $state(true);
    rowSelectionMode: 'single' | 'multiple' = $state('single');
    enableSelectAll: boolean = $state(true);
    onRowSelectionChange(selectedRows: string[]) {}
}