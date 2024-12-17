<script lang="ts">
	import type { Row } from '$lib/tzezars-datagrid/core/processors/data-processor.svelte';
	import Collapse from '$lib/icons/collapse.svelte';
	import Expand from '$lib/icons/expand.svelte';
	import type { DatagridConfig } from '$lib/tzezars-datagrid/core/index.svelte';

	let { row, grid }: { row: Row<any>; grid: DatagridConfig<any, any> } = $props();

	const handleExpandRow = (id: string) => {
		if (grid.rowManager.expansionMode === 'none') return
		grid.reload(() => grid.rowManager.toggleRowExpansion(id));
	};
</script>

<div
	class="flex h-full w-full items-center justify-center"
	aria-label="Click to expand row"
	role="button"
	tabindex="0"
	onclick={() => handleExpandRow(String(row?.original?.id))}
	onkeydown={(e) => {
		if (['Enter', 'Spacebar'].includes(e.key)) handleExpandRow(String(row?.original?.id));
	}}
>
	
</div>
