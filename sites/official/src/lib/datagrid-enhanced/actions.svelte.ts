import type { DatagridCore } from "$lib/datagrid/core/index.svelte";
import type { Action } from "svelte/action";

export const identifier: Action<HTMLElement, { datagrid: DatagridCore, value: string }> = (node, { datagrid, value }) => {
    $effect(() => {
        node.id = datagrid.gridIdentifier + '-' + value;

        return () => {
            // teardown goes here
        };
    });
};