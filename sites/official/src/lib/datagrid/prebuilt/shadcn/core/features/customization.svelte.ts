import type { LeafColumn } from "$lib/datagrid/core/types";
import { cn } from "$lib/utils";
import type { TzezarsDatagrid } from "../index.svelte";



interface DataGridCustomization {
  size?: 'compact' | 'default' | 'relaxed';
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

  // getWrapperClasses = () => {
  //   return cn(
  //     'grid-wrapper',
  //     this.customization?.variant && `grid-wrapper-${this.customization.variant}`,
  //     this.customization?.size && `grid-size-${this.customization.size}`,
  //     this.customization?.enableAnimation && 'grid-animate-rows grid-animate-cells',
  //     this.customization?.customScrollbar && 'grid-custom-scrollbar',
  //     this.customization?.responsive && 'grid-responsive',
  //     this.customization?.loading && 'grid-loading',
  //     this.classes?.wrapper
  //   );
  // };

  // getRowClasses = () => {
  //   return cn('grid-row')
  // }


  getBodyOverlayClasses = () => {
    return cn('grid-body-overlay')
  }

  getWrapperClasses = () => {
    return cn('grid-wrapper')
  }

  getContainerClasses = () => {
    return cn('grid-container')
  }

  getHeadClasses = () => {
    return cn('grid-head')
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

  getBodyRowClasses = () => {
    return cn('grid-body-row')
  }

  getBodyRowExpandedClasses = () => {
    return cn('grid-body-row-expanded')
  }

  getBodyRowCellClasses = () => {
    return cn('grid-body-row-cell')
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

}