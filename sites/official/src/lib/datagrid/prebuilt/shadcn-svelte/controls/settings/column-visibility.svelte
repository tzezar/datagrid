<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	let { datagrid }: { datagrid: DataGrid<any> } = $props();
</script>

<div class="flex flex-col place-items-start gap-2 pb-6">
	<label for="toggleColumns">Column visibility:</label>
	{#each datagrid.columnManager.getLeafColumns() as column}
		<button
			class=""
			onclick={() => datagrid.columnVisibility.toggleColumnVisibility(column.columnId)}
		>
			<span>
				{column.header}
			</span>
		</button>
	{/each}
</div>
