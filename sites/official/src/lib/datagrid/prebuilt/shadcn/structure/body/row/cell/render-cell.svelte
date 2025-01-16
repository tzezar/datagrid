<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import Cell from './cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
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
	<Cell {datagrid} {row} {column}>
		{@html getCellContent(column, row.original)}
	</Cell>
{/if}
