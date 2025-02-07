<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';

	let { data } = $props();

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.users,

		extra: {
			features: {
				clickToCopy: {
					onClickToCopy(value) {
						toast.info(`Copied ${value} to clipboard`);
					}
				},
				animations: {
					animateRows: true,
					animateHeaders: true
				},
			}
		}
	});

	const col = datagrid.columns[0];
	if (col.type === 'accessor' && col._meta.tooltip) {
	}
</script>

<Grid.Component {datagrid}></Grid.Component>
