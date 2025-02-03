import type { Datagrid } from "$lib/datagrid/core/index.svelte";
import type { Action } from "svelte/action";

export const identifier: Action<HTMLElement, { datagrid: Datagrid, value: string }> = (node, { datagrid, value }) => {
    $effect(() => {
        node.id = datagrid.identifier + '-' + value;

        return () => {
            // teardown goes here
        };
    });
};