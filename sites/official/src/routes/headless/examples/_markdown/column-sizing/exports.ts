import ColumnSizingDatagrid from "./column-sizing-datagrid.svelte";
import ColumnSizingDatagridCode from "./column-sizing-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnSizingDatagrid,
        code: ColumnSizingDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }