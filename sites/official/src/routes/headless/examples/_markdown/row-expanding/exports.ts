import RowExpandingDatagrid from "./row-expanding-datagrid.svelte";
import RowExpandingDatagridCode from "./row-expanding-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: RowExpandingDatagrid,
        code: RowExpandingDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }