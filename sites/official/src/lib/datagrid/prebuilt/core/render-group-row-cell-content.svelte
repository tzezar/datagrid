<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
		header: Snippet<[DataGrid<any>, LeafColumn<any>, GridGroupRow<any>]>;
		aggregations: Snippet<[LeafColumn<any>, GridGroupRow<any>]>;
	};

	let { datagrid, column, row, header: header, aggregations: aggregations }: Props = $props();



</script>

{#if column.columnId == row.groupKey}
	{@render header(datagrid, column, row)}
{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
	{@render aggregations(column, row)}
{/if}
