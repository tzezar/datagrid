<script lang="ts">
    import type { Datagrid } from './datagrid/core/index.svelte';
	import type { GridRow } from './datagrid/core/types';
    
    let { row, datagrid }: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();

</script>


<div class='flex flex-row gap-2'>
    <button onclick={() => datagrid.rowPinning.pinToTop(row.index)}>pin to top</button>
    <button onclick={() => datagrid.rowPinning.pinToBottom(row.index)}>pin to bottom</button>
</div>