<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Row } from '$lib/tzezars-datagrid/processors/data-processor.svelte';
	import Collapse from '$lib/icons/collapse.svelte';
	import Expand from '$lib/icons/expand.svelte';

	let { row, grid }: { row: Row<any>; grid: Datagrid<any, any> } = $props();

	const handleExpandRow = (id: string) => {
		if (grid.rowManager.expansionMode === 'none') return
		grid.reload(() => grid.rowManager.toggleRowExpansion(id));
	};
</script>

<div
class="flex w-full h-full justify-center items-center "
	aria-label="Click to expand row"
	role="button"
	tabindex="0"
	onclick={() => handleExpandRow(String(row?.original?.id))}
	onkeydown={(e) => {
		if (['Enter', 'Spacebar'].includes(e.key)) handleExpandRow(String(row?.original?.id));
	}}
>
	<button class="my-auto h-fit !px-0 !py-0" tabindex="-1">
		{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
			<Expand />
		{:else}
			<Collapse />
		{/if}
	</button>
</div>
