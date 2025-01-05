<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import HeaderCell from './_components/datagrid/header-cell.svelte';
	import Row from './_components/datagrid/row.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import DatagridSettingsDropdown from '$lib/datagrid/prebuilt/shadcn-svelte/controls/settings/datagrid-settings-dropdown.svelte';
	import GlobalSearch from '$lib/datagrid/prebuilt/shadcn-svelte/controls/global-search.svelte';
	import GroupBy from '$lib/datagrid/prebuilt/shadcn-svelte/controls/group-by.svelte';

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
				{#each datagrid.cache.paginatedRows || [] as row (row.index)}
					<Row {datagrid} {row} />
				{/each}
			</div>
		</div>
		<div class='grid-footer-container'>
			<Pagination {datagrid} />
			<GroupBy {datagrid} />
		</div>
	</div>
</div>
