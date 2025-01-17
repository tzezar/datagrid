import { ColumnSizingFeature } from "$lib/datagrid/core/features";



export class ExtraColumnSizingFeature extends ColumnSizingFeature<any> {
    enableColumnSizing: boolean = $state(true);
    onColumnResize(columnId: string, width: number) { }
    columnResizeMode: 'standard' | 'fluid' = $state('standard') // fluid changes width on mouse move
}