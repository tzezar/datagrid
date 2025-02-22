import SortingDatagrid from "./sorting-datagrid.svelte";
import SortingDatagridCode from "./sorting-datagrid.svelte?raw";


import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: SortingDatagrid,
        code: SortingDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }