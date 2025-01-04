// utils.ts or a helper file
import type { Component } from 'svelte';

export type CellContent = { component: Component<any>, props: object } | string | HTMLElement;

export function renderCellContent(cell: CellContent, row: any, datagrid: any) {
  if (typeof cell === 'string' || cell instanceof HTMLElement) {
    return { html: cell };
  }

  if (typeof cell === 'object' && 'component' in cell) {
    return {
      component: cell.component,
      props: { ...cell.props, datagrid }
    };
  }

  return { html: '' };
}