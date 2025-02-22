import RowPinningDatagrid from "./row-pinning-datagrid.svelte";
import RowPinningDatagridCode from "./row-pinning-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: RowPinningDatagrid,
        code: RowPinningDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }