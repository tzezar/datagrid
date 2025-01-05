<script lang="ts">
	import '$lib/datagrid/styles.css';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import GridControls from './_components/grid-controls/grid-controls.svelte';
	import HeaderCell from './_components/datagrid/header-cell.svelte';
	import Row from './_components/datagrid/row.svelte';
	import Pagination from './_components/datagrid/pagination.svelte';
	import { VirtualList } from 'svelte-virtuallists';
	import type { GridRow } from '$lib/datagrid/core/types';

	let { data } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});
</script>

<input
	type="text"
	value={datagrid.globalSearch.value}
	oninput={(e) => {
		datagrid.globalSearch.value = e.currentTarget.value;
		datagrid.processors.data.executeFullDataTransformation();
	}}
/>

<div class="w-[200px] h-[250px] relative overflow-auto">
	<div class="o">
		<div class="grid-header">
			<div class="grid-header-row w-max">
				{#each datagrid.columns as column (column.header)}
					<HeaderCell {datagrid} {column} />
				{/each}
			</div>
		</div>
		<div class="w-max">
			<VirtualList items={datagrid.cache.paginatedRows} style="height:100px" isTable={false}>
				{#snippet header()}{/snippet}
				{#snippet vl_slot({ item, index }: { item: GridRow<any>; index: number })}
					<Row {datagrid} row={item} />
					{/snippet}
				</VirtualList>
			</div>
	</div>
</div>

<Pagination {datagrid} />
<GridControls {datagrid} />
