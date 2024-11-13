<script lang="ts">
	import type { Row } from '$lib/datagrid/processors/data-processor.svelte';
	import { Datagrid } from '$lib/datagrid/index.svelte';

	let { row, grid }: { row: Row<any>; grid: Datagrid<any, any> } = $props();
</script>

<div
	class='w-full h-full justify-center items-center flex'
	aria-label="Click to toggle row selection"
	role="button"
	tabindex="0"
	onclick={() => grid.rowManager.toggleRowSelection(String(row?.original?.id))}
	onkeydown={(e) => {
		if (e.key === 'Enter') {
			grid.rowManager.toggleRowSelection(String(row?.original?.id));
			e.preventDefault();
		}
	}}
>
	<input type="checkbox" checked={grid.rowManager.isRowSelected(String(row?.original?.id))} />
</div>
