import EditableDataDatagrid from "./editable-data-datagrid.svelte";
import EditableDataDatagridCode from "./editable-data-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: EditableDataDatagrid,
        code: EditableDataDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }