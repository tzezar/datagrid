import BasicDatagrid from "./basic-datagrid.svelte";
import BasicDatagridCode from "./basic-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    basic: {
        component: BasicDatagrid,
        code: BasicDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }