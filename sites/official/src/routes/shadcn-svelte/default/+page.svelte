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

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});

</script>

<div class='flex flex-col'>
	<div class="flex justify-end top-bar">
		<GlobalSearch {datagrid} />
		<Button
			class="rounded-none border-b-0 border-r-0"
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
	<div class="grid-wrapper">
		<div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columnManager.getColumnsInOrder() as column (column)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getTopRows() as row (row.identifier)}
					<Row {datagrid} {row} />
				{/each}
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					<Row {datagrid} {row} />
				{/each}

				{#each datagrid.rowPinning.getBottomRows() as row (row.identifier)}
					<Row {datagrid} {row} />
				{/each}
			</div>
		</div>
		<div class="grid-footer-container">
		</div>
	</div>
	<Pagination {datagrid} />
</div>

<style>
	.top-bar {
		background-color: hsl(var(--grid-header));
	}
</style>
