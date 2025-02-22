import HeaderGroupsDatagrid from "./header-groups-datagrid.svelte";
import HeaderGroupsDatagridCode from "./header-groups-datagrid.svelte?raw";

import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const exports = {
    datagrid: {
        component: HeaderGroupsDatagrid,
        code: HeaderGroupsDatagridCode
    },

    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    }
}

export { exports }