<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		column,
		grid,
		row
	}: { children?: Snippet; column: Column<any>; grid: Datagrid<any, any>; row: any } = $props();
</script>

<div
	class="grid-cell"
	style="--offset:{column.pinning.offset}px; {column.size.grow === false
		? `--width:${column.size.width}px; --max-width:${column.size.width}px;`
		: 'flex-grow: 1;'} --min-width:{column.size.minWidth}px;"
>
	{#if column.columnId === row.columnId && Object.keys(row.aggregates).find((key) => key === column.columnId)}
		<span>{row.groupId}</span>
	{:else if row.aggregates[column.columnId]}
		{#each Object.entries(row.aggregates[column.columnId]) as [aggKey, aggValue]}
			<span>{aggKey}: {(aggValue as number).toFixed(2)}</span>
		{/each}
	{/if}
</div>
