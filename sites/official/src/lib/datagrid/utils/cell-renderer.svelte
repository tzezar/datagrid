<script lang="ts">
	import type { DatagridInstance } from '../index.svelte';
	import type { Column } from '../processors/column-processor.svelte';
	import type { Row } from '../processors/data-processor.svelte';
	type Props = {
		column: Column<any>;
		row: Row<any>
		grid: DatagridInstance<any, any>;
	};
	let { column, row, grid }: Props = $props();
</script>

{#if column.cell && column.cell.component}
	<svelte:component this={column.cell.component} {row} {grid} {column}/>
{:else if column.formatter}
	{column.formatter(row.original)}
{:else}
	{column.accessor(row.original)}
{/if}
