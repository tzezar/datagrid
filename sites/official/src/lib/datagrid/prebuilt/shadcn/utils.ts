import type { TzezarsDatagrid } from "./core/index.svelte";

export function shouldShowColumnFilter(datagrid: TzezarsDatagrid): boolean {
    return datagrid.extra.features.columnFiltering.isEnabled();
}