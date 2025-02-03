import type { AccessorColumn, AnyColumn, CellValue, ComputedColumn } from "$lib/datagrid/core/types";
import { getCellContent } from "$lib/datagrid/core/utils.svelte";
import type { TzezarsDatagrid } from "../index.svelte";
import type { ShadcnColumnMeta } from "../types";
import type { Feature } from "./types";

export type ClickToCopyFeatureConfig = {
    enableClickToCopy?: boolean;
    onClickToCopy?(value: string | number): void;
};

export class ClickToCopyFeature implements Feature {
    datagrid: TzezarsDatagrid

    /**
     * Displays the copy button, but only in valid cells
    */
    display: boolean = $state(true);
    
    onClickToCopy: (value: string | number) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: ClickToCopyFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: ClickToCopyFeatureConfig) {
        this.display = config?.enableClickToCopy ?? this.display;
        this.onClickToCopy = config?.onClickToCopy ?? this.onClickToCopy;
    }

    shouldDisplayCopyButton(column: AccessorColumn<any, ShadcnColumnMeta> | ComputedColumn<any, ShadcnColumnMeta>) {
        return (this.display === true && column._meta.clickToCopy !== false) ||
            column._meta.clickToCopy === true;
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