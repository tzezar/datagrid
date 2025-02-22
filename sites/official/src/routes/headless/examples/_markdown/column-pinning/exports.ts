import ColumnPinningDatagrid from "./column-pinning-datagrid.svelte";
import ColumnPinningDatagridCode from "./column-pinning-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnPinningDatagrid,
        code: ColumnPinningDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }