<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';

	let { row, datagrid }: { row: any; datagrid: Datagrid<any> } = $props();
</script>

<input
	type="checkbox"
	checked={datagrid.rowSelection.isRowSelected(row.original.id)}
	onchange={() => datagrid.rowSelection.toggleRowSelection(row.original.id)}
/>
