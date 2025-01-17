<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import {  isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
		groupedCell: Snippet<[DataGrid<any>, LeafColumn<any>, GridGroupRow<any>]>;
		aggregatedCell: Snippet<[LeafColumn<any>, GridGroupRow<any>]>;
	};

	let { datagrid, column, row, groupedCell, aggregatedCell }: Props = $props();
</script>

{#if column.columnId == row.groupKey}
	{#if column.groupedCell}
		{@const cellContent = column.groupedCell({ datagrid, column, row })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else}
		{@render groupedCell(datagrid, column, row)}
	{/if}
{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
	{#if column.aggregatedCell}
		{@const cellContent = column.aggregatedCell({ datagrid, column, row })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else}
		{@render aggregatedCell(column, row)}
	{/if}
{/if}
