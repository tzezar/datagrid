<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { userColumns, type Column } from './columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn-svelte/row.svelte';
	import HeaderCell from '$lib/datagrid/prebuilt/shadcn-svelte/header-cell.svelte';
	import GridHeader from './_components/grid-header.svelte';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core';

	let { data } = $props();

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
	<GridHeader {datagrid} />
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
					<Row {datagrid} {row} class={{
					}} />
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
