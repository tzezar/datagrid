import type { GridBasicRow, LeafColumn } from "$lib/datagrid/core/types";
import { cn } from "$lib/utils";
import { shouldHighlightSelectedRow } from "../../utils";
import type { TzezarsDatagrid } from "../index.svelte";











interface DataGridCustomization {
  // size?: 'compact' | 'default' | 'relaxed';
  theme: 'default' | 'shadcn';
  // variant?: 'bordered' | 'elevated' | 'flat';
  // headerStyle?: 'minimal' | 'prominent' | 'subtle';
  cellTooltips?: boolean;
  customScrollbar?: boolean;
  stickyHeader?: boolean;


  // enableAnimation?: boolean;
  // enableRowHover?: boolean;
  // enableSelection?: boolean;
  // responsive?: boolean;
  // loading?: boolean;
}




export type CustomizationFeatureConfig<TOriginalRow> = {
  datagrid?: TzezarsDatagrid<TOriginalRow>
  customization?: DataGridCustomization;

  getHeadClasses?: () => string
  getBodyRowClasses?: (row: GridBasicRow<TOriginalRow>, rowIndex: number) => string
  getBodyRowCellClasses?: (datagrid: TzezarsDatagrid, row: GridBasicRow<any>, column: LeafColumn<any>) => string
}


export class StylesFeature<TOriginalRow> {
  customization: CustomizationFeature<TOriginalRow>

  constructor(customization: CustomizationFeature<TOriginalRow>) {
    this.customization = customization
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

  getBodyRowCellClasses = (datagrid: TzezarsDatagrid<TOriginalRow>, row: GridBasicRow<TOriginalRow>, column: LeafColumn<TOriginalRow>) => {
    return cn('grid-body-row-cell',
      shouldHighlightSelectedRow(datagrid, row) && 'grid-body-row-cell-highlighted',
      column._meta.styles?.bodyCell({ datagrid, column, row }),
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


export class CustomizationFeature<TOriginalRow> {
  datagrid: TzezarsDatagrid<TOriginalRow>

  stickyHeader = $state(true)
  cellTooltips = $state(true)
  customScrollbar = $state(true)
  theme = $state('shadcn')

  styling = new StylesFeature(this)


  constructor(datagrid: TzezarsDatagrid<TOriginalRow>, config?: CustomizationFeatureConfig<TOriginalRow>) {
    this.datagrid = datagrid

    this.cellTooltips = config?.customization?.cellTooltips ?? this.cellTooltips;
    this.theme = config?.customization?.theme ?? this.theme;
    this.customScrollbar = config?.customization?.customScrollbar ?? this.customScrollbar;
    // this.customization.enableAnimation = config?.customization?.enableAnimation ?? this.customization.enableAnimation;
    // this.customization.enableRowHover = config?.customization?.enableRowHover ?? this.customization.enableRowHover;
    // this.customization.enableSelection = config?.customization?.enableSelection ?? this.customization.enableSelection;
    // this.customization.headerStyle = config?.customization?.headerStyle ?? this.customization.headerStyle;
    // this.customization.responsive = config?.customization?.responsive ?? this.customization.responsive;
    // this.customization.loading = config?.customization?.loading ?? this.customization.loading;
    // this.customization.size = config?.customization?.size ?? this.customization.size;
    // this.customization.variant = config?.customization?.variant ?? this.customization.variant;
  }






}