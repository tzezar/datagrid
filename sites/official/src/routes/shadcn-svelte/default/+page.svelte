<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { DataGrid, type GridConfig } from '$lib/datagrid/core/index.svelte';
	import { userColumns, type Column } from './columns.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn-svelte/controls/pagination.svelte';
	import Row from '$lib/datagrid/prebuilt/shadcn-svelte/row.svelte';
	import HeaderCell from '$lib/datagrid/prebuilt/shadcn-svelte/header-cell.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import GridHeader from './_components/grid-header.svelte';

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

	class TzezarsDatagrid extends DataGrid<any> {
		constructor(config: GridConfig<any>) {
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
