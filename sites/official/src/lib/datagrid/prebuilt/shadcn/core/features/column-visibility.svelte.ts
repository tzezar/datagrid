
export class ExtraColumnVisibilityFeature {
    enableColumnVisibility: boolean = $state(true);
    onColumnVisibilityChange(hiddenColumns: string[]) {}
}