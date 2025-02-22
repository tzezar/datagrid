import ColumnFiltersDatagrid from "./column-filters-datagrid.svelte";
import ColumnFiltersDatagridCode from "./column-filters-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnFiltersDatagrid,
        code: ColumnFiltersDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }