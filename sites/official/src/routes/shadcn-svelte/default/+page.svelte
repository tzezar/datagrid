<script lang="ts">
	import { flip } from 'svelte/animate';
	import '$lib/datagrid/styles.css';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import DatagridSettingsDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte';
	import GroupBy from '$lib/datagrid/prebuilt/shadcn-svelte/controls/group-by.svelte';
	import HeaderCell from '$lib/datagrid/prebuilt/shadcn-svelte/header-cell.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn-svelte/row.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});
</script>

<div>
	<div class="flex justify-end">
		<GlobalSearch {datagrid} />
		<DatagridSettingsDropdown {datagrid} />
	</div>
	<div class="grid-wrapper">
		<div class="grid-container">
			<div class="grid-header">
				<div class="grid-header-row">
					{#each datagrid.columns as column (column.header)}
						<HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getTopRows() as row (row.index)}
					<div
						in:fade={{ duration: 100, delay: 100 }}
						animate:flip={{ easing: cubicInOut, duration: 200 }}
					>
						<Row {datagrid} {row} />
					</div>
				{/each}

				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					<div
						in:fade={{ duration: 100, delay: 100 }}
						animate:flip={{ easing: cubicInOut, duration: 200 }}
					>
						<Row {datagrid} {row} />
					</div>
				{/each}

				{#each datagrid.rowPinning.getBottomRows() as row (row.index)}
					<div
						in:fade={{ duration: 100, delay: 100 }}
						animate:flip={{ easing: cubicInOut, duration: 200 }}
					>
						<Row {datagrid} {row} />
					</div>
				{/each}
			</div>
		</div>
		<div class="grid-footer-container">
			<Pagination {datagrid} />
			<GroupBy {datagrid} />
		</div>
	</div>
</div>

<style>
	.grid-body > div {
		will-change: transform;
	}
</style>
