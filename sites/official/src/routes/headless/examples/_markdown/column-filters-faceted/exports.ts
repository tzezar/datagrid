import ColumnFiltersFacetedDatagrid from "./column-filters-faceted-datagrid.svelte";
import ColumnFiltersFacetedDatagridCode from "./column-filters-faceted-datagrid.svelte?raw";


import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: ColumnFiltersFacetedDatagrid,
        code: ColumnFiltersFacetedDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }