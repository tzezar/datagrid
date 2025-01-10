<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { userColumns  } from './columns.svelte';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core';

	import * as Grid from '$lib/datagrid/prebuilt/shadcn-svelte/_components';
	import GridHeader from './_components/grid-header.svelte';

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
						<Grid.HeaderCell {datagrid} {column} />
					{/each}
				</div>
			</div>
			<div class="grid-body">
				{#each datagrid.rowPinning.getTopRows() as row (row.identifier)}
					<Grid.BodyRow {datagrid} {row} />
				{/each}
				{#each datagrid.rowPinning.getCenterRows() as row (row.identifier)}
					<Grid.BodyRow {datagrid} {row} class={{}} />
				{/each}

				{#each datagrid.rowPinning.getBottomRows() as row (row.identifier)}
					<Grid.BodyRow {datagrid} {row} />
				{/each}
			</div>
		</div>
		<div class="grid-footer-container"></div>
	</div>
	<Grid.Pagination {datagrid} />
</div>
