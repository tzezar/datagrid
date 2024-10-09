// not implemented
// @ts-nocheck
import type { TzezarDataGrid } from "../tzezar-datagrid.svelte";

export const stickyWhenExpanded = (datagrid: TzezarDataGrid, rowId: number) => datagrid.state.expandedRows.includes(rowId) ? `sticky top-[${datagrid.headerHeight}px] z-[4998]` : 'z-[4999]'