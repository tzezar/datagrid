<script lang="ts">
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';

	let { data } = $props();

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,
		initialState: {
			sorting: {
				sortConfigs: [{columnId: 'name', 'direction': 'ascending'}]
			}
		}
	});

</script>

<Grid.Component {datagrid}></Grid.Component>
