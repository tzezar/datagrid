import VirtualizedDatagrid from "./virtualized-datagrid.svelte";
import VirtualizedDatagridCode from "./virtualized-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: VirtualizedDatagrid,
        code: VirtualizedDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }