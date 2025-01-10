<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { userColumns  } from './columns.svelte';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn-svelte/core';

	import * as Grid from '$lib/datagrid/prebuilt/shadcn-svelte/_components';
	import GridHeader from './_components/grid-header.svelte';
	import type { GridBasicRow, GridRow } from '$lib/datagrid/core/types';
	import { DataGrid } from '$lib/datagrid/core/index.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { User } from './generate-users';
	import type { AnyColumn } from '$lib/datagrid/core/column-creation/types';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});

	// const datagrid = new Datagrid({
	// 	columns: userColumns,
	// 	data: data.users
	// });

	function getBodyRowCellStyles<T>(row: GridRow<User>, column: AnyColumn<User>) {
		// console.log(row.identifier, column.columnId)
		if (isGroupColumn(column)) {
			return
		} 
		row = row as GridBasicRow<any>;
		if (row.original.id === 2 && column.columnId ==='role') {
			return 'bg-red-400'
		}

	}




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
					<Grid.BodyRow {datagrid} {row}  />
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
