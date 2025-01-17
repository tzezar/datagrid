

export class RowActionsFeature {
    enableRowActions: boolean = $state(true);
    positionRowActions: 'left' | 'right' = $state('right');
 
    onRowActionClick(row: any, action: string) {

    }
}