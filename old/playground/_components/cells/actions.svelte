<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Row } from '$lib/tzezars-datagrid/processors/data-processor.svelte';
	import Collapse from '../icons/collapse.svelte';
	import Expand from '../icons/expand.svelte';

	let { row, grid }: { row: Row; grid: Datagrid } = $props();
</script>

<div class="flex">
	<button
		onclick={() => grid.rowManager.toggleRowExpansion(String(row?.original?.id))}
		class="my-auto ml-2 h-fit !px-0 !py-0"
	>
		{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
			<Expand />
		{:else}
			<Collapse />
		{/if}
	</button>
</div>
