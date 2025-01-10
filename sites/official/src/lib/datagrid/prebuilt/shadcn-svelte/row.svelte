<script lang="ts">
	import GroupRowCell from './group-row-cell.svelte';
	import BodyRowCell from './body-row-cell.svelte';
	import type { GridBasicRow, GridGroupRow } from '$lib/datagrid/core/types';
	import { flattenColumns, isGridGroupRow } from '$lib/datagrid/core/utils.svelte';
	import type { TzezarsDatagrid } from './types';

	let {
		datagrid,
		row,
		class: _class = {
			row: '',
			rowCell: '',
			groupRow: '',
			groupRowCell: ''
		}
	}: {
		datagrid: TzezarsDatagrid
		row: GridBasicRow<any> | GridGroupRow<any>;
		class?: {
			row?: string;
			rowCell?: string;
			groupRow?: string;
			groupRowCell?: string
		};
	} = $props();

	let structuredColumns = $derived(flattenColumns(datagrid.columnManager.getColumnsInOrder()));
	let leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
</script>

{#snippet GroupRow(row: GridGroupRow<any>)}
	<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
		{#each structuredColumns as column, columnIndex (columnIndex)}
			{#if column.state.visible === true}
				<GroupRowCell {datagrid} {column} {row} />
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet BasicRow(row: GridBasicRow<any>)}
	<div class="grid-body-row">
		{#each leafColumns as column (column)}
			{#if column.state.visible === true}
				<BodyRowCell {datagrid} {column} {row} class={_class.rowCell} />
			{/if}
		{/each}
	</div>
	{#if row.isExpanded()}
		<div class="grid-body-row">
			<div class="grid-body-cell">
				<div class="grid-body-cell">
					Content for row with ID {row.identifier}
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
