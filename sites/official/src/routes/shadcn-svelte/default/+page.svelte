<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { Datagrid, type DatagridConfig } from '$lib/datagrid/core/index.svelte';
	import { userColumns, type Column } from './columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import DatagridSettingsDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn-svelte/row.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FilterAlt from '$lib/datagrid/icons/material-symbols/filter-alt.svelte';
	import FilterAltOff from '$lib/datagrid/icons/material-symbols/filter-alt-off.svelte';
	import HeaderCell from '$lib/datagrid/prebuilt/shadcn-svelte/header-cell.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type User from 'lucide-svelte/icons/user';

	let { data } = $props();

	const handleDropdownMenu = (columns: AnyColumn<any>[]) => {
		columns.forEach((column) => {
			if (isGroupColumn(column)) {
				const groupColumn = column as GroupColumn<any>;
				handleDropdownMenu(groupColumn.columns);
			}
			column = column as LeafColumn<any>;
			column._meta.showColumnManagerDropdownMenu =
				column._meta.showColumnManagerDropdownMenu ?? true;
		});
		return columns;
	};

	class TzezarsDatagrid extends Datagrid<any> {
		constructor(config: DatagridConfig<any>) {
			super(config, handleDropdownMenu);
		}
	}

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});

	// const datagrid = new Datagrid({
	// 	columns: userColumns,
	// 	data: data.users
	// });
</script>

<div class="flex flex-col">
	<div class="top-bar flex justify-end">
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
		<div class="grid-footer-container"></div>
	</div>
	<Pagination {datagrid} />
</div>

<style>
	.top-bar {
		background-color: hsl(var(--grid-header));
	}
</style>
