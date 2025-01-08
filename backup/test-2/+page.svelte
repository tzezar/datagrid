<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import DatagridSettingsDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte';
	import GroupBy from '$lib/datagrid/prebuilt/shadcn-svelte/controls/group-by.svelte';
	import HeaderCell from '$lib/datagrid/prebuilt/shadcn-svelte/header-cell.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn-svelte/row.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterAlt from '$lib/datagrid/icons/material-symbols/filter-alt.svelte';
	import FilterAltOff from '$lib/datagrid/icons/material-symbols/filter-alt-off.svelte';
	import BodyRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/body-row-cell.svelte';
	import { flattenColumns, isGridGroupRow } from '$lib/datagrid/core/utils.svelte';
	import GroupRowCell from '$lib/datagrid/prebuilt/shadcn-svelte/group-row-cell.svelte';

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});

	let columnsPinnedToLeft = $derived(datagrid.columnManager.getColumnsPinnedToLeft());
	let columnsPinnedToRight = $derived(datagrid.columnManager.getColumnsPinnedToRight());
	let columnsPinnedToNone = $derived(datagrid.columnManager.getColumnsPinnedToNone());
</script>

<div class="w-full max-w-max">
	<div class="flex justify-end">
		<GlobalSearch {datagrid} />
		<Button
			class="rounded-none"
			variant="outline"
			onclick={() => datagrid.filtering.toggleColumnFiltering()}
		>
			{#if datagrid.filtering.showColumnFiltering}
				<FilterAlt />
			{:else}
				<FilterAltOff />
			{/if}
		</Button>

		<DatagridSettingsDropdown {datagrid} />
	</div>
	<div class="flex flex-row">
		<div class="grid-container max-w-[400px] overflow-auto">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.createHierarchicalColumns(columnsPinnedToLeft) as column (column)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					{#if isGridGroupRow(row)}
						<div
							class="grid-body-group-row"
							data-depth={row.depth}
							data-expanded={datagrid.rowManager.isGroupRowExpanded(row)}
						>
							{#each flattenColumns(columnsPinnedToLeft).filter((col) => col.type !== 'group') as column, columnIndex (columnIndex)}
								{#if column.state.visible === true}
									<GroupRowCell {datagrid} {column} {row} />
								{/if}
							{/each}
						</div>
					{:else}
						<div class="grid-body-row">
							{#each flattenColumns(columnsPinnedToLeft).filter((col) => col.type !== 'group') as column (column)}
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
					{/if}

				
				{/each}
			</div>
		</div>
		<!-- <div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.createHierarchicalColumns(columnsPinnedToLeft) as column (column)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					<div class="grid-body-row">
						{#each flattenColumns(columnsPinnedToLeft).filter((col) => col.type !== 'group') as column (column)}
							<BodyRowCell {datagrid} {column} {row} />
						{/each}
					</div>
				{/each}
			</div>
		</div> -->
		<div class="grid-container max-w-[400px] overflow-auto">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.createHierarchicalColumns(columnsPinnedToNone) as column (column)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					{#if isGridGroupRow(row)}
						<div
							class="grid-body-group-row"
							data-depth={row.depth}
							data-expanded={datagrid.rowManager.isGroupRowExpanded(row)}
						>
							{#each flattenColumns(columnsPinnedToNone).filter((col) => col.type !== 'group') as column, columnIndex (columnIndex)}
								{#if column.state.visible === true}
									<GroupRowCell {datagrid} {column} {row} />
								{/if}
							{/each}
						</div>
					{:else}
						<div class="grid-body-row">
							{#each flattenColumns(columnsPinnedToNone).filter((col) => col.type !== 'group') as column (column)}
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
					{/if}

				
				{/each}
			</div>
		</div>
		<!-- <div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.createHierarchicalColumns(columnsPinnedToRight) as column (column)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					<div class="grid-body-row">
						{#each flattenColumns(columnsPinnedToRight).filter((col) => col.type !== 'group') as column (column)}
							<BodyRowCell {datagrid} {column} {row} />
						{/each}
					</div>
				{/each}
			</div>
		</div> -->
	</div>
	<div class="grid-footer-container">
		<Pagination {datagrid} />
	</div>
	<GroupBy {datagrid} />
</div>

<style>
</style>
