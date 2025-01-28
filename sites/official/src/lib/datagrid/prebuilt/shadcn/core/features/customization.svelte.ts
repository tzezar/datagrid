import type { GridBasicRow, LeafColumn } from "$lib/datagrid/core/types";
import { cn } from "$lib/utils";
import { shouldHighlightSelectedRow } from "../../utils";
import type { TzezarsDatagrid } from "../index.svelte";



interface DataGridCustomization {
  size?: 'compact' | 'default' | 'relaxed';
  theme: 'default' | 'shadcn';
  variant?: 'bordered' | 'elevated' | 'flat';
  headerStyle?: 'minimal' | 'prominent' | 'subtle';
  enableAnimation?: boolean;
  enableRowHover?: boolean;
  enableSelection?: boolean;
  customScrollbar?: boolean;
  responsive?: boolean;
  loading?: boolean;
  stickyHeader?: boolean;
}

interface DataGridClasses {
  wrapper?: string | null;
}



export type CustomizationFeatureConfig = {
  customization: DataGridCustomization;
  classes?: DataGridClasses;
}



export class CustomizationFeature {
  datagrid: TzezarsDatagrid
  customization: DataGridCustomization = {
    theme: 'shadcn',
    customScrollbar: true,
    // enableAnimation: true,
    // enableRowHover: true,
    // enableSelection: true,
    headerStyle: 'minimal',
    responsive: true,
    loading: false,
    size: 'default',
    variant: 'flat',

    stickyHeader: true,
  }
  classes: DataGridClasses = {
    wrapper: '',

  }

  constructor(datagrid: TzezarsDatagrid, config?: CustomizationFeatureConfig) {
    this.datagrid = datagrid

    this.customization.theme = config?.customization?.theme ?? this.customization.theme;
    this.customization.customScrollbar = config?.customization?.customScrollbar ?? this.customization.customScrollbar;
    this.customization.enableAnimation = config?.customization?.enableAnimation ?? this.customization.enableAnimation;
    this.customization.enableRowHover = config?.customization?.enableRowHover ?? this.customization.enableRowHover;
    this.customization.enableSelection = config?.customization?.enableSelection ?? this.customization.enableSelection;
    this.customization.headerStyle = config?.customization?.headerStyle ?? this.customization.headerStyle;
    this.customization.responsive = config?.customization?.responsive ?? this.customization.responsive;
    this.customization.loading = config?.customization?.loading ?? this.customization.loading;
    this.customization.size = config?.customization?.size ?? this.customization.size;
    this.customization.variant = config?.customization?.variant ?? this.customization.variant;

    this.classes.wrapper = config?.classes?.wrapper ?? this.classes.wrapper;

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

  getHeadRowLeafColumnCellContentClasses = (column: LeafColumn<any>) => {
    return cn('grid-head-row-leaf-column-cell-content', column.options.sortable &&
      this.datagrid.extra.features.sorting.enableSorting === true && 'sortable')
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

  getBodyRowClasses = (row: GridBasicRow<any>, rowIndex: number) => {
    return cn('grid-body-row',
      this.datagrid.extra.features.stripedRows.applyStripedRows(row, rowIndex)
    )
  }

  getBodyRowExpandedClasses = () => {
    return cn('grid-body-row-expanded')
  }

  getBodyRowCellClasses = (datagrid: TzezarsDatagrid, row: GridBasicRow<any>, column: LeafColumn<any>) => {
    return cn('grid-body-row-cell',
      shouldHighlightSelectedRow(datagrid, row) && 'bg-blue-400/10',
      column._meta.styles?.bodyCell({ datagrid, column, row }),
    )
  }

  getBodyRowCellContentClasses = () => {
    return cn('grid-body-row-cell-content')
  }

  getBodyGroupRowClasses = () => {
    return cn('grid-body-group-row')
  }

  getCopyFeedbackClasses = () => {
    return cn('copy-feedback')
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