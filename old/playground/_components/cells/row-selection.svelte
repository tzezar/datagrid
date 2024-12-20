<script lang="ts">
	import type { Row } from '$lib/tzezars-datagrid/processors/data-processor.svelte';
	import { Datagrid } from '$lib/tzezars-datagrid/index.svelte';

	let { row, grid }: { row: Row; grid: Datagrid } = $props();
</script>

<input
	type="checkbox"
	checked={grid.rowManager.isRowSelected(String(row?.original?.id))}
	onchange={() => grid.rowManager.toggleRowSelection(String(row?.original?.id))}
/>
