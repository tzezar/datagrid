<script lang="ts">
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../../../core/index.svelte';
	import GroupCell from './cell/group-cell.svelte';
	import GroupCellContent from './cell/group-cell-content.svelte';
	import GroupCellAggregations from '../../../components/group-cell-aggregations.svelte';

	type Props = {
		columns: LeafColumn<any>[];
		datagrid: TzezarsDatagrid;
		row: GridGroupRow<any>;

		children: Snippet<[row: GridGroupRow<any>]>;
	};
	let { row, children, datagrid, columns }: Props = $props();
</script>

<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
	{#if children}
		{@render children(row)}
	{:else}
		{#each columns as column, columnIndex (column.columnId)}
			<GroupCell {column} {row} {datagrid}>
				{#snippet content()}
					<GroupCellContent {column} {row} {datagrid} />
				{/snippet}
				{#snippet aggregations()}
					<GroupCellAggregations {column} {row} {datagrid} />
				{/snippet}
			</GroupCell>
		{/each}
	{/if}
</div>
