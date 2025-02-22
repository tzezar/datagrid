import ColumnPinningDetachedDatagrid from "./column-pinning-detached-datagrid.svelte";
import ColumnPinningDetachedDatagridCode from "./column-pinning-detached-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnPinningDetachedDatagrid,
        code: ColumnPinningDetachedDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }