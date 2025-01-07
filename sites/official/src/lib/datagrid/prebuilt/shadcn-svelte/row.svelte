<script lang="ts">

	import GroupRowCell from './group-row-cell.svelte';
	import BodyRowCell from './body-row-cell.svelte';
	import type { GridBasicRow, GridGroupRow } from '$lib/datagrid/core/types';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { flattenColumns, isGridGroupRow } from '$lib/datagrid/core/utils.svelte';

	let { datagrid, row }: { datagrid: Datagrid<any>; row: GridBasicRow<any> | GridGroupRow<any> } =
		$props();
</script>

{#snippet GroupRow(row: GridGroupRow<any>)}
	<div
		class="grid-body-group-row"
		data-depth={row.depth}
		data-expanded={datagrid.rowManager.isGroupRowExpanded(row)}
	>
		{#each flattenColumns(datagrid.columnManager.getColumnsInOrder()) as column, columnIndex (columnIndex)}
			{#if column.state.visible === true}
				<GroupRowCell {datagrid} {column} {row} />
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet BasicRow(row: GridBasicRow<any>)}
	<div class="grid-body-row" >
		{#each flattenColumns(datagrid.columnManager.getColumnsInOrder()) as column (column)}
			{#if column.state.visible === true}
				<BodyRowCell {datagrid} {column} {row} />
			{/if}
		{/each}
	</div>
	{#if datagrid.rowExpanding.isRowExpanded(row.index)}
		<div class="grid-body-row">
			<div class="grid-body-cell">
				<div class="grid-body-cell">
					Content for row with ID {row.original.id}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

{#if isGridGroupRow(row)}
	{@render GroupRow(row)}
{:else}
	{@render BasicRow(row)}
{/if}
