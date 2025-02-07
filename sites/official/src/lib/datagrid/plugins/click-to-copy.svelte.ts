import type { AccessorColumn, AnyColumn, CellValue, ComputedColumn } from "$lib/datagrid/core/types";
import { getCellContent } from "$lib/datagrid/core/utils.svelte";
import type { ColumnMetaEnhanced } from "../../datagrid-enhanced/core/types";

export type ClickToCopyPluginConfig = {
    enableClickToCopy?: boolean;
    onClickToCopy?(value: string | number): void;
};

export class ClickToCopyPlugin {

    /**
     * Displays the copy button, but only in valid cells
    */
    display: boolean = $state(true);
    
    onClickToCopy: (value: string | number) => void = () => { };

    constructor(config?: ClickToCopyPluginConfig) {
        this.display = config?.enableClickToCopy ?? this.display;
        this.onClickToCopy = config?.onClickToCopy ?? this.onClickToCopy;
    }

    shouldDisplayCopyButton(column: AccessorColumn<any, ColumnMetaEnhanced> | ComputedColumn<any, ColumnMetaEnhanced>) {
        if (this.display === false) return false;
        if (column._meta.clickToCopy === false) return false;
        return true
    }

    isValidColumn(column: AnyColumn<any>): column is AccessorColumn<any> | ComputedColumn<any> {
        return column.type === 'accessor' || column.type === 'computed';
    }


    private copyToClipboard(value: string | number) {
        const stringValue = String(value);
        navigator.clipboard.writeText(stringValue);
        this.onClickToCopy(value);
    }


    handleClickToCopy(row: any, column: AccessorColumn<any> | ComputedColumn<any>) {
        const value: CellValue = getCellContent(column, row);

        if (typeof value !== 'string' && typeof value !== 'number') {
            return;
        }

        this.copyToClipboard(value);
    }

    addCopyFeedback(element: HTMLElement) {
        element.classList.add('copy-feedback');
        setTimeout(() => {
            element.classList.remove('copy-feedback');
        }, 1000);
    }

}