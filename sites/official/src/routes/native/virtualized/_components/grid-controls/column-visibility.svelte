
<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { filterOutGroupColumns, flattenColumns } from '$lib/datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

<div class="flex flex-col place-items-start gap-2 pb-6">
	<label for="toggleColumns">Column visibility:</label>
	{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
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
