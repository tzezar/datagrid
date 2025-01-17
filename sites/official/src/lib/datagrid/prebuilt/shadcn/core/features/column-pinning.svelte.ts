import { ColumnPinningFeature } from "$lib/datagrid/core/features";

export class ExtraColumnPinningFeature extends ColumnPinningFeature<any> {
    enableColumnPinning: boolean = $state(true);
    onColumnPinningChange(pinnedColumns: string[]) {}
}