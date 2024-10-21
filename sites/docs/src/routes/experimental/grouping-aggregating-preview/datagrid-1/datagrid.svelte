<script lang="ts">
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';
	import { columns } from '../columns.svelte';
	import DatagridBody from './datagrid-body.svelte';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data,
			columns,
			title: 'Variant I',
			state: {
				grouping: ['category', 'manufacturer'],
				sortingArray: [
					{ columnId: 'category', direction: 'asc' },
					{ columnId: 'manufacturer', direction: 'asc' }
				]
			},
			options: {
				paginate: false,
				pagination: {display: true},
				grouping: true,
				topbar: {
					display: true
				}
			}
		})
	);

</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		<DatagridBody data={datagrid.state.processedData} columns={datagrid.columns} />
	{/snippet}
</Datagrid.Datagrid>
