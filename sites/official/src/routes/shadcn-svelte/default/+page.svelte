<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { userColumns } from './columns.svelte';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core';

	import * as Grid from '$lib/datagrid/prebuilt/shadcn-svelte/_components';
	import GridHeader from './_components/grid-header.svelte';
	import type { GridBasicRow, GridGroupRow, GridRow, LeafColumn } from '$lib/datagrid/core/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { User } from './generate-users';
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import { isCellComponent, isGridGroupRow as isGroupRow } from '$lib/datagrid/core/utils.svelte';
	import { cn } from '$lib/utils';
	import GroupRowCellContent from '$lib/datagrid/prebuilt/core/group-row-cell-content.svelte';
	import BasicRowCellContent from '$lib/datagrid/prebuilt/core/basic-row-cell-content.svelte';
	import BodyRowGroupCellHeader from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-row-group-cell-header.svelte';
	import BodyRowGroupCellAggregations from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-row-group-cell-aggregations.svelte';
	import BodyBasicRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-basic-row-cell.svelte';
	import BodyGroupRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/body-group-row-cell.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-cell-dropdown.svelte';
	import HeaderGroupCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-group-cell.svelte';
	import BasicHeaderCellContent from '$lib/datagrid/prebuilt/core/basic-header-cell-content.svelte';
	import HeaderColumnActions from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-column-actions.svelte';
	import HeaderColumnFilters from '$lib/datagrid/prebuilt/shadcn-svelte/_components/header-column-filters.svelte';
	import HeaderBasicCell from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-basic-cell.svelte';
	import HeaderBasicCellWrapper from '$lib/datagrid/prebuilt/shadcn-svelte/_components/base/header-basic-cell-wrapper.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});

	// const datagrid = new Datagrid({
	// 	columns: userColumns,
	// 	data: data.users
	// });

	// function getBodyRowCellStyles<T>(row: GridRow<User>, column: AnyColumn<User>) {
	// 	// console.log(row.identifier, column.columnId)
	// 	if (column.isGroupColumn()) {
	// 		return;
	// 	}
	// 	row = row as GridBasicRow<any>;
	// 	if (row.original.id === 2 && column.columnId === 'role') {
	// 		return 'bg-red-400';
	// 	}
	// }
</script>

{#snippet GroupRow(row: GridGroupRow<any>, leafColumns: LeafColumn<any>[])}
	<div class="grid-body-group-row" data-depth={row.depth} data-expanded={row.isExpanded()}>
		{#each leafColumns as column, columnIndex (columnIndex)}
			<BodyGroupRowCell {datagrid} {column} {row}>
				<GroupRowCellContent {datagrid} {column} {row}>
					{#snippet header()}
						<BodyRowGroupCellHeader {datagrid} {column} {row} />
					{/snippet}
					{#snippet aggregations()}
						<BodyRowGroupCellAggregations {datagrid} {column} {row} />
					{/snippet}
				</GroupRowCellContent>
			</BodyGroupRowCell>
		{/each}
	</div>
{/snippet}

{#snippet BasicRow(row: GridBasicRow<any>, leafColumns: LeafColumn<any>[])}
	<div class="grid-body-row">
		{#each leafColumns as column (column)}
			<BodyBasicRowCell {datagrid} {column} {row}>
				<BasicRowCellContent {datagrid} {column} {row} />
			</BodyBasicRowCell>
		{/each}
	</div>
	{#if row.isExpanded()}
		<div class="grid-body-row">
			<div class="grid-body-cell">
				Content for row with ID {row.identifier}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet HeaderGroupCellSnippet(column: GroupColumn<any>)}
	<HeaderGroupCell {datagrid} {column}>
		<div
			class="grid-header-group-header box-border flex items-center justify-center gap-2 text-center"
		>
			{column.header}
			<HeaderCellDropdown {datagrid} {column} />
		</div>
		<div class="flex grow flex-row">
			{#each column.columns ?? [] as subColumn (subColumn.columnId)}
				{@render HeaderCell(subColumn)}
			{/each}
		</div>
	</HeaderGroupCell>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	<HeaderBasicCell {datagrid} {column}>
		<HeaderBasicCellWrapper
			{datagrid}
			{column}
			onclick={(e) => datagrid.handlers.sorting.toggleColumnSorting(column, e)}
		>
			<BasicHeaderCellContent {datagrid} {column}>
				{#snippet title(header)}
					<span class="grid-header-cell-content-header">{header}</span>
				{/snippet}
			</BasicHeaderCellContent>
			<HeaderColumnActions {datagrid} {column} />
		</HeaderBasicCellWrapper>

		<HeaderColumnFilters {datagrid} {column} />
	</HeaderBasicCell>
{/snippet}

{#snippet HeaderCell(column: AnyColumn<any>)}
	{#if isGroupColumn(column)}
		{@render HeaderGroupCellSnippet(column)}
	{:else if column.state.visible === true}
		{@render HeaderCellSnippet(column)}
	{/if}
{/snippet}

<div class="flex flex-col">
	<GridHeader {datagrid} />
	<div class="grid-wrapper">
		<div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.getColumnsInOrder() as column (column)}
						{@render HeaderCell(column)}
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rows.getVisibleRows() as row (row.identifier)}
					{@const columns = datagrid.columnManager.getLeafColumnsInOrder()}
					{#if isGroupRow(row)}
						{@render GroupRow(row, columns)}
					{:else}
						{@render BasicRow(row, columns)}
					{/if}
				{/each}
			</div>
		</div>
		<div class="grid-footer-container"></div>
	</div>
	<Grid.Pagination {datagrid} />
</div>
