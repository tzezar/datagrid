<script lang='ts'>
	import Button from "$lib/components/ui/button/button.svelte";
	import type { EnhancedDatagrid } from "$lib/datagrid-enhanced/core/index.svelte";

    type Props = {
        datagrid: EnhancedDatagrid<any>
    };

    let { datagrid }: Props = $props();


</script>
<div>
    <p>Pagination</p>
    <div>
        <Button
            onclick={() => {
                datagrid.extra.features.pagination.position = 'none';
            }}
        >
            Hide
        </Button>
        <Button
            onclick={() => {
                datagrid.extra.features.pagination.position = 'top';
            }}
        >
            Top
        </Button>
        <Button
            onclick={() => {
                datagrid.extra.features.pagination.position = 'bottom';
            }}
        >
            Bottom
        </Button>
        <Button
            onclick={() => {
                datagrid.extra.features.pagination.position = 'both';
            }}
        >
            Both
        </Button>
    </div>
</div>