import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

export function getSortingPosition(field: string, datagrid: TzezarDatagrid<unknown>): number | null {
    const index = datagrid.state.sortingArray.findIndex((s) => s.columnId === field);
    return index !== -1 ? index + 1 : null;
}