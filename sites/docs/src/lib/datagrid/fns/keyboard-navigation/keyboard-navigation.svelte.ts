import { getContext } from "svelte";
import { handleKeyDown } from "./handle-key-down.svelte";
import type { TzezarDatagrid } from "$lib/datagrid/tzezar-datagrid.svelte";


export const keyboardNavigation = (node: HTMLElement, enabled = false) => {
    if (!enabled) return;
    
    const datagrid = getContext<TzezarDatagrid<unknown>>("datagrid");

    node.addEventListener("keydown", (e) => {
        handleKeyDown({
            event: e,
            focusedRowIndex: datagrid.internal.keyboardNavigation.focusedRowIndex,
            focusedColumnIndex: datagrid.internal.keyboardNavigation.focusedColumnIndex,
            visibleData: datagrid.internal.paginatedData,
            columns: datagrid.columns,
            identifier: datagrid.identifier,
        });
    });

    return {
        destroy() {
            // @ts-expect-error ts(2322)
            node.removeEventListener("keydown", handleKeyDown);
        },
    };
}
