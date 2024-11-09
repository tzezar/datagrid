<script lang="ts">
	import { setContext } from 'svelte';
	import { inventoryData as data, type InventoryDataRow as Row } from '$lib/data/inventory';
	import type { BaseColumn } from '$lib/datagrid/types';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import Datagrid from '$lib/datagrid/datagrid.svelte';

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

	setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.splice(0, 100),
			columns,
			options: {
				defaultColumnWidth: '200px'
			}
		})
	);
</script>

<Datagrid />
