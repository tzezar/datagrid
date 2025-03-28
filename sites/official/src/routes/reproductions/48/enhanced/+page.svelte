<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import { inventoryData as data } from '$lib/data/data-storage.svelte';
	import * as Grid from '$lib/datagrid-enhanced';

	import { accessorColumn, type ColumnDef } from '$lib/datagrid/index.js';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'name'
		}),
		accessorColumn({
			accessorKey: 'category'
		}),
		accessorColumn({
			accessorKey: 'price.retail'
		})
	] satisfies ColumnDef<InventoryItem>[];

	let newData = data.slice(0, 50).map(({ id, ...rest }) => rest);

	const datagrid = new Grid.EnhancedCore({
		columns,
		data: newData,
		rowIdGetter: (row) => row.sku,
		// Generating a random ID every time
		// rowIdGetter: (row) => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	});

	console.log({
		data: newData,
		rows: datagrid.rows.getVisibleBasicRows()
	});
</script>

<Grid.Component {datagrid}></Grid.Component>
