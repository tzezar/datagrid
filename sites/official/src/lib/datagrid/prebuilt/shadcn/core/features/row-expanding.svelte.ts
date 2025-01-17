import { RowExpandingFeature } from "$lib/datagrid/core/features";



export class ExtraRowExpandingFeature extends RowExpandingFeature<any> {
    enableRowExpanding: boolean = $state(true);
    expandingMode: 'single' | 'multiple' = $state('single');
    expandingPosition: 'left' | 'right' = $state('left');
    onExpandingChange(expandedRows: string[]) {}
}