
import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const onExample = `eventService.on("custom", (payload) => {
    console.log(payload)
});`
const offExample = `eventService.off("custom", handler);`

const emitExample = `eventService.emit("custom", { message: "Hello, world!" });`

const livecycleHooksExample1 = `static readonly HOOKS = {
        PRE_PROCESS_ORIGINAL_COLUMNS: 'preProcessOriginalColumns', // works on original columns
        POST_PROCESS_ORIGINAL_COLUMNS: 'postProcessOriginalColumns', // works on original columns
        PRE_PROCESS_COLUMNS: 'preProcessColumns',
        POST_PROCESS_COLUMNS: 'postProcessColumns',
        PRE_PROCESS_DATA: 'preProcessData',
        POST_PROCESS_DATA: 'postProcessData',
        PRE_SORT: 'preSort',
        POST_SORT: 'postSort',
        PRE_GLOBAL_SEARCH: 'preGlobalSearch',
        POST_GLOBAL_SEARCH: 'postGlobalSearch',
        PRE_FILTER: 'preFilter',
        POST_FILTER: 'postFilter',
    } as const;`


const exports = {
    components: {
        codeBlock: CodeBlock,
        codePreview: CodePreview
    },

    code: {
        dataCaching1: `// example 1
datagrid.refresh(()=> {
    datagrid.cacheManager.invalidate('everything');
})
// example 2
datagrid.refresh(()=> {
    datagrid.cacheManager.invalidate('everything');
}, {recalculateAll: true})

// example 3
datagrid.cacheManager.invalidate('everything');
datagrid.processors.data.executeFullDataTransformation();`,
        dataCaching2: `datagrid.cacheManager.invalidate('filteredData'); // Clears only the filtered data cache
datagrid.cacheManager.invalidate('everything'); // Clears all cache types`
        ,

        reactingToEvents: {
            onExample,
            offExample,
            emitExample
        },
        lifecycleHooks: {
            example1: livecycleHooksExample1
        }

    }


}

export { exports }