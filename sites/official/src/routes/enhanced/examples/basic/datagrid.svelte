<script lang="ts">
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import * as Grid from '$lib/datagrid-enhanced';
	import { columns } from './columns';

	let { data }: { data: InventoryItem[] } = $props();

	let datagrid = new Grid.EnhancedCore({
		columns,
		data
	});
</script>

<Grid.Component {datagrid} />
