<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				paginate: false,
				pagination: { display: false }
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
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							{...props}
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
						/>
					{:else}
						<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
