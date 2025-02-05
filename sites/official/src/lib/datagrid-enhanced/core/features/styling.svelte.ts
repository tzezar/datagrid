import type { GridBasicRow, LeafColumn } from "$lib/datagrid/core/types"
import { cn } from "$lib/utils"
import { shouldHighlightSelectedRow } from "../../utils";
import type { TzezarsDatagrid } from "../index.svelte"
import type { ColumnMetaEnhanced } from "../types";
import type { CustomizationFeature } from "./customization.svelte"

export type StylingFeatureConfig<TOriginalRow> = {
    getHeadClasses?: () => string;
    getBodyRowClasses?: (row: GridBasicRow<TOriginalRow>, rowIndex: number) => string;
    getBodyRowCellClasses?: (datagrid: TzezarsDatagrid<TOriginalRow>, row: GridBasicRow<TOriginalRow>, column: LeafColumn<TOriginalRow>) => string;
    getWrapperOverlayClasses?: () => string;
    getBodyOverlayClasses?: () => string;
    getWrapperClasses?: () => string;
    getContainerClasses?: () => string;
    getHeadRowClasses?: () => string;
    getHeadRowLeafColumnCellClasses?: () => string;
    getHeadRowLeafColumnCellContentClasses?: (column: LeafColumn<TOriginalRow>) => string;
    getHeadRowGroupColumnCellContentClasses?: () => string;
    getHeadRowGroupColumnCellClasses?: () => string;
    getHeadRowGroupColumnCellHeaderClasses?: () => string;
    getBodyClasses?: () => string;
    getBodyRowExpandedClasses?: () => string;
    getBodyRowCellContentClasses?: () => string;
    getBodyGroupRowClasses?: () => string;
    getHeadRowLeafColumnFilterInputWrapperClasses?: () => string;
    getHeadRowLeafColumnFilterInputClasses?: () => string;
    getFooterContainerClasses?: () => string;
    getToolbarContainerClasses?: () => string;
    getPaginationContainerClasses?: (classes?: string) => string;
    getPaginationContainerPageInputClasses?: () => string;
};

export class StylingFeature<TOriginalRow> {
    customization: CustomizationFeature<TOriginalRow>

    constructor(customizationFeature: CustomizationFeature<TOriginalRow>, config?: StylingFeatureConfig<TOriginalRow>) {
        this.customization = customizationFeature
        Object.assign(this, config);
    }

    getWrapperOverlayClasses = () => {
        return cn('grid-wrapper-overlay')
    }

    getBodyOverlayClasses = () => {
        return cn('grid-body-overlay')
    }

    getWrapperClasses = () => {
        return cn('grid-wrapper',
            this.customization?.customScrollbar && 'grid-custom-scrollbar',
        )
    }

    getContainerClasses = () => {
        return cn('grid-container',
            this.customization?.theme === 'shadcn' && 'grid-container-shadcn'
        )
    }

    getHeadClasses = () => {
        return cn('grid-head',
            this.customization?.theme === 'shadcn' && 'grid-head-shadcn',
            this.customization.stickyHeader && 'grid-head-sticky'
        )
    }

    getHeadRowClasses = () => {
        return cn('grid-head-row')
    }

    getHeadRowLeafColumnCellClasses = () => {
        return cn('grid-head-row-leaf-column-cell')
    }

    getHeadRowLeafColumnCellContentClasses = (column: LeafColumn<TOriginalRow>) => {
        return cn('grid-head-row-leaf-column-cell-content', column.options.sortable &&
            this.customization.datagrid.extra.features.sorting.enableSorting === true && 'sortable')
    }

    getHeadRowGroupColumnCellContentClasses = () => {
        return cn('grid-head-row-group-column-cell-content')
    }

    getHeadRowGroupColumnCellClasses = () => {
        return cn('grid-head-row-group-column-cell')
    }

    getHeadRowGroupColumnCellHeaderClasses = () => {
        return cn('grid-head-row-group-column-cell-header')
    }

    getBodyClasses = () => {
        return cn('grid-body')
    }

    getBodyRowClasses = (row: GridBasicRow<TOriginalRow>, rowIndex: number) => {
        return cn('grid-body-row',
            this.customization.datagrid.extra.features.stripedRows.applyStripedRows(row, rowIndex)
        )
    }

    getBodyRowExpandedClasses = () => {
        return cn('grid-body-row-expanded')
    }

    getBodyRowCellClasses = (datagrid: TzezarsDatagrid<TOriginalRow>, row: GridBasicRow<TOriginalRow>, column: LeafColumn<TOriginalRow, ColumnMetaEnhanced>) => {
        return cn('grid-body-row-cell',
            shouldHighlightSelectedRow(datagrid, row) && 'grid-body-row-cell-highlighted',
            column._meta.styles?.bodyCell?.({ datagrid, column, row }),
        )
    }

    getBodyRowCellContentClasses = () => {
        return cn('grid-body-row-cell-content')
    }

    getBodyGroupRowClasses = () => {
        return cn('grid-body-group-row')
    }


    getHeadRowLeafColumnFilterInputWrapperClasses = () => {
        return cn('grid-head-row-leaf-column-filter-input-wrapper')
    }

    getHeadRowLeafColumnFilterInputClasses = () => {
        return cn('grid-head-row-leaf-column-filter-input')
    }

    getFooterContainerClasses = () => {
        return cn('grid-footer-container')
    }

    getToolbarContainerClasses = () => {
        return cn('grid-toolbar-container')
    }

    getPaginationContainerClasses = (classes?: string) => {
        return cn('grid-pagination-container', classes)
    }

    getPaginationContainerPageInputClasses = () => {
        return cn('grid-pagination-container-page-input')
    }
}
