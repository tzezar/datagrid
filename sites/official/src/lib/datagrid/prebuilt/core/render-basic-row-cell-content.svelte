<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';

	type Props = {
		datagrid: DatagridCore<any>;
		column: LeafColumn<any>;
		row: GridBasicRow<any>;
	};

	let { datagrid, column, row }: Props = $props();
</script>

{#if column.cell}
	{@const cellContent = column.cell({ datagrid, column, row })}
	{#if typeof cellContent === 'string'}
		{@html cellContent}
	{:else if isCellComponent(cellContent)}
		<cellContent.component {datagrid} {row} {column} />
	{/if}
{:else}
	{@html getCellContent(column, row.original)}
{/if}
