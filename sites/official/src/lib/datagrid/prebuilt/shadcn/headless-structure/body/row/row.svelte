<script lang="ts">
	import type { GridBasicRow, GridGroupRow, GridRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { Snippet } from 'svelte';
	import BasicRow from '../../body/row/basic-row.svelte';
	import GroupRow from '../../body/row/group-row.svelte';
	import GroupCellAggregations from '../../../built-in/group-cell-aggregations.svelte';
	import GroupCellContent from './cell/group-cell-content.svelte';
	import GroupCell from './cell/group-cell.svelte';
	import RenderCell from './cell/render-cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridRow<any>;
		columns: LeafColumn<any>[];

		groupRow?: Snippet<[row: GridGroupRow<any>]>;
		basicRow?: Snippet<[row: GridBasicRow<any>]>;
	};
	let { datagrid, row, columns, groupRow, basicRow }: Props = $props();
</script>

{#if row.isGroupRow()}
	{#if groupRow}
		{@render groupRow(row)}
	{:else}
		<GroupRow {row} columns={columns} {datagrid}>
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
		</GroupRow>
	{/if}
{:else if basicRow}
	{@render basicRow(row)}
{:else}
	<BasicRow {datagrid} {row} columns={columns}>
		{#each columns as column (column.columnId)}
			<RenderCell {datagrid} {row} {column} />
		{/each}
	</BasicRow>
{/if}
