
import CodeBlock from "$lib/components/tzezars-enhancements/code-block/code-block.svelte";
import CodePreview from "$lib/components/tzezars-enhancements/code-preview/code-preview.svelte";

const onExample = `eventService.on("custom", (payload) => {
    console.log(payload)
});`
const offExample = `eventService.off("custom", handler);`

const emitExample = `eventService.emit("custom", { message: "Hello, world!" });`

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
        }

    }


}

export { exports }