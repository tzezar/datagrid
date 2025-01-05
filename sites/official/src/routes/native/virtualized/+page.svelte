<script lang="ts">
	import type {
		GridRow,
	} from '$lib/datagrid/core/types';
	import { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { VirtualList } from 'svelte-virtuallists';
	import { userColumns } from './columns.svelte';
	import Pagination from './_components/datagrid/pagination.svelte';
	import type { User } from './generate-users';
	import Row from './_components/datagrid/row.svelte';
	import '$lib/datagrid/styles.css';
	import HeaderCell from './_components/datagrid/header-cell.svelte';
	import GlobalSearch from './_components/grid-controls/global-search.svelte';

	let { data }: { data: { users: User[] } } = $props();

	const datagrid = new Datagrid({
		columns: userColumns,
		data: data.users
	});

</script>



<GlobalSearch {datagrid} />
<div class="grid-wrapper">
	<div class="grid">
		<VirtualList
			items={datagrid.cache.paginatedRows}
			class="list-table"
			style="height:600px"
			isTable={true}
		>
			{#snippet header()}
				<div class="grid-header">
					<div class="grid-header-row">
						{#each datagrid.columns as column (column.header)}
							<HeaderCell {datagrid} {column} />
						{/each}
					</div>
				</div>
			{/snippet}
			{#snippet vl_slot({ item, index }: { item: GridRow<any>; index: number })}
				<!-- {@render Row(item)} -->
				<Row {datagrid} row={item} />
			{/snippet}
		</VirtualList>
	</div>
</div>

<Pagination {datagrid} /> 

