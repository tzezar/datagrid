import ColumnVisibilityDatagrid from "./column-visibility-datagrid.svelte";
import ColumnVisibilityDatagridCode from "./column-visibility-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnVisibilityDatagrid,
        code: ColumnVisibilityDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }