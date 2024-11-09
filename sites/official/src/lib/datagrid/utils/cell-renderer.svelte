<script lang="ts">
	import type { DatagridInstance } from '../index.svelte';
	import type { Column } from '../processors/column-processor.svelte';
	import type { Row } from '../processors/data-processor.svelte';
	type Props = {
		column: Column;
		row: Row;
		grid: DatagridInstance;
	};
	let { column, row, grid }: Props = $props();
</script>

{#if column.cell && column.cell.component}
	<svelte:component this={column.cell.component} {row} {grid} />
{:else if column.formatter}
	{column.formatter(row.original)}
{:else}
	{column.accessor(row.original)}
{/if}
