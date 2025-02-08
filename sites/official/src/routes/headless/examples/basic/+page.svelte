<script lang="ts">
	import { type AnyColumn } from '$lib/datagrid/core/types';
	import { accessorColumn, computedColumn } from '$lib/datagrid/core/column-creation';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import type { ColumnMetaEnhanced } from '$lib/datagrid-enhanced/core/types';
	import { DatagridCore } from '$lib/datagrid/core/index.svelte.js';

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
			accessorKey: 'price'
		}),
		accessorColumn({
			accessorKey: 'quantity'
		}),
		accessorColumn({
			accessorKey: 'supplier.name'
		}),
		accessorColumn({
			accessorKey: 'restockDate'
		}),
		accessorColumn({
			accessorKey: 'status'
		})
	] satisfies AnyColumn<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[];

	let { data } = $props();



</script>
