<script lang="ts">
	import type { BaseColumn } from '$lib/datagrid/types';
	import type { InventoryDataRow as Row } from '$lib/data/inventory';
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';

	export const columns = [
		{
			id: 'product.name',
			title: 'Product name',
            grow: true
		},
		{
			id: 'price',
			title: 'Price'
		}
	] satisfies BaseColumn<Row>[];

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.splice(0, 100),
			columns,
			options: {
				defaultColumnWidth: '200px',
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
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
