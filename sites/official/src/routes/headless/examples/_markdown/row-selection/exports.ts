import RowSelectionDatagrid from "./row-selection-datagrid.svelte";
import RowSelectionDatagridCode from "./row-selection-datagrid.svelte?raw";
import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: RowSelectionDatagrid,
        code: RowSelectionDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }