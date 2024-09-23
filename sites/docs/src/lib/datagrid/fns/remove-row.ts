import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";
export const removeRow = (id: number | string, datagrid: TzezarDatagrid<{ id: string | number }>) => {
    datagrid.data = datagrid.data.filter((row) => row.id as string | number !== id);
};