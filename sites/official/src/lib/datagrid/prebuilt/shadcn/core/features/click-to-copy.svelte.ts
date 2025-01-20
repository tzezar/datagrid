import type { AccessorColumn, AnyColumn, CellValue, ComputedColumn } from "$lib/datagrid/core/types";
import { getCellContent } from "$lib/datagrid/core/utils.svelte";

export type ClickToCopyFeatureConfig = {
    enableClickToCopy?: boolean;
    onClickToCopy?(value: string | number): void;
};

export class ClickToCopyFeature {
    enableClickToCopyOnAllCells: boolean = $state(true);
    onClickToCopy: (value: string | number) => void = () => { };

    constructor(config?: ClickToCopyFeatureConfig) {
        if (config) {
            this.enableClickToCopyOnAllCells = config.enableClickToCopy ?? this.enableClickToCopyOnAllCells;
            this.onClickToCopy = config.onClickToCopy ?? this.onClickToCopy;
        }
    }

    handleClickToCopy(row: any, column: AccessorColumn<any> | ComputedColumn<any>) {
        const value: CellValue = getCellContent(column, row);
        
        if (typeof value !== 'string' && typeof value !== 'number') {
            return;
        }
        
        this.copyToClipboard(value);
    }

    private copyToClipboard(value: string | number) {
        const stringValue = String(value);
        navigator.clipboard.writeText(stringValue);
        this.onClickToCopy(value);
    }

    shouldDisplayCopyButton(column: AccessorColumn<any> | ComputedColumn<any>) {
        return (this.enableClickToCopyOnAllCells === true && column._meta.clickToCopy !== false) ||
            column._meta.clickToCopy === true;
    }

    isValidColumn(column: AnyColumn<any>): column is AccessorColumn<any> | ComputedColumn<any> {
        return column.type === 'accessor' || column.type === 'computed';
    }
}