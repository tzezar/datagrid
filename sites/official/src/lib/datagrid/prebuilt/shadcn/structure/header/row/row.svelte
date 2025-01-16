<script lang="ts">
	import type { GridBasicRow, GridGroupRow, GridRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import GroupCell from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell.svelte';
	import GroupCellContent from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell-content.svelte';
	import GroupCellAggregations from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/group-cell-aggregations.svelte';
	import RenderCell from '$lib/datagrid/prebuilt/shadcn/structure/body/row/cell/render-cell.svelte';
	import type { Snippet } from 'svelte';
	import BasicRow from '../../body/row/basic-row.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridRow<any>;
		leafColumns: LeafColumn<any>[];

		groupRow?: Snippet<[row: GridGroupRow<any>]>;
		basicRow?: Snippet<[row: GridBasicRow<any>]>;
	};
	let { datagrid, row, leafColumns, groupRow, basicRow }: Props = $props();
</script>

{#if row.isGroupRow()}
	<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
		{#if groupRow}
			{@render groupRow(row)}
		{:else}
			{#each leafColumns as column, columnIndex (column.columnId)}
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
{:else if basicRow}
	{@render basicRow(row)}
{:else}
	<BasicRow {datagrid} {row} {leafColumns}>
		{#each leafColumns as column (column.columnId)}
			<RenderCell {datagrid} {row} {column} />
		{/each}
	</BasicRow>
{/if}
