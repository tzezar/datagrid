<script lang='ts'>
	import Button from "$lib/components/ui/button/button.svelte";
	import type { EnhancedDatagrid } from "$lib/datagrid-enhanced/core/index.svelte";

    type Props = {
        datagrid: EnhancedDatagrid<any>
    };

    let { datagrid }: Props = $props();


</script>
<div>
    <p>Row selection</p>
    <div>
        <p>Position</p>
        <Button
            onclick={() => {
                datagrid.extra.features.rowExpanding.position = 'left';
            }}
        >
            Left
        </Button>
        <Button
            onclick={() => {
                datagrid.extra.features.rowExpanding.position = 'right';
            }}
        >
            Right
        </Button>
        <Button
            onclick={() => {
                datagrid.extra.features.rowExpanding.position = 'none';
            }}
        >
            None
        </Button>
    </div>
</div>