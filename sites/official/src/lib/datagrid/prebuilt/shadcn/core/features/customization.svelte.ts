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
}

interface DataGridClasses {
  wrapper?: string;
  header?: string;
  row?: string;
  cell?: string;
  toolbar?: string;
  footer?: string;
  pagination?: string;
}


export class CustomizationFeature {
  datagrid: TzezarsDatagrid
  customization: DataGridCustomization;
  classes: DataGridClasses;

  constructor(datagrid: TzezarsDatagrid) {
    this.datagrid = datagrid
    this.customization = {
      theme: 'shadcn',
      customScrollbar: true,
      enableAnimation: true,
      enableRowHover: true,
      enableSelection: true,
      headerStyle: 'minimal',
      responsive: true,
      loading: false,
      size: 'default',
      variant: 'flat',
    };
    this.classes = {
      wrapper: '',
      header: '',
      row: '',
      cell: '',
      toolbar: '',
      footer: '',
      pagination: '',
    }
  }

  getWrapperOverlayClasses = () => {
    return cn('grid-wrapper-overlay')
  }

  getBodyOverlayClasses = () => {
    return cn('grid-body-overlay')
  }

  getWrapperClasses = () => {
    return cn('grid-wrapper')
  }

  getContainerClasses = () => {
    return cn('grid-container',
      this.customization?.theme === 'shadcn' && 'grid-container-shadcn'
    )
  }

  getHeadClasses = () => {
    return cn('grid-head',
      this.customization?.theme === 'shadcn' && 'grid-head-shadcn'
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