<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import GridControls from './_components/grid-controls/grid-controls.svelte';
	import HeaderCell from './_components/datagrid/header-cell.svelte';
	import Row from './_components/datagrid/row.svelte';
	import Pagination from './_components/datagrid/pagination.svelte';
	import GlobalSearch from './_components/grid-controls/global-search.svelte';

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});
</script>

<GlobalSearch {datagrid} />
<div class="grid-wrapper">
	<div class="grid">
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
			<!-- {#each datagrid.rowPinning.getTopRows() as row (row.index)}
				<Row {datagrid} {row} />
			{/each}

			{#each datagrid.rowPinning.getCenterRows() as row (row.index)}
				<Row {datagrid} {row} />
			{/each}

			{#each datagrid.rowPinning.getBottomRows() as row (row.index)}
				<Row {datagrid} {row} />
			{/each} -->
		</div>
	</div>
</div>

<Pagination {datagrid} />
<GridControls {datagrid} />
