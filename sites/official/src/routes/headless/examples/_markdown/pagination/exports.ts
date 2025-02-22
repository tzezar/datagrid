import PaginationDatagrid from "./pagination-datagrid.svelte";
import PaginationDatagridCode from "./pagination-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: PaginationDatagrid,
        code: PaginationDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }