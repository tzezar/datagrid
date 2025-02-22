import ColumnOrderingDatagrid from "./column-ordering-datagrid.svelte";
import ColumnOrderingDatagridCore from "./column-ordering-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnOrderingDatagrid,
        code: ColumnOrderingDatagridCore
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }