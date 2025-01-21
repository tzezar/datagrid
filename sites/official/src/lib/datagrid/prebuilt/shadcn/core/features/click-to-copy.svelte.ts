import type { AccessorColumn, AnyColumn, CellValue, ComputedColumn } from "$lib/datagrid/core/types";
import { getCellContent } from "$lib/datagrid/core/utils.svelte";

export type ClickToCopyFeatureConfig = {
    enableClickToCopy?: boolean;
    onClickToCopy?(value: string | number): void;
};

export class ClickToCopyFeature {
    enableInAllValidCells: boolean = $state(true);
    onClickToCopy: (value: string | number) => void = () => { };

    constructor(config?: ClickToCopyFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: ClickToCopyFeatureConfig) {
        this.enableInAllValidCells = config?.enableClickToCopy ?? this.enableInAllValidCells;
        this.onClickToCopy = config?.onClickToCopy ?? this.onClickToCopy;
    }

    shouldDisplayCopyButton(column: AccessorColumn<any> | ComputedColumn<any>) {
        return (this.enableInAllValidCells === true && column._meta.clickToCopy !== false) ||
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