<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';

	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { Datagrid } from '$lib/datagrid';

	setContext(
		'datagrid',
		new TzezarDatagrid({
			data,
			columns
		})
	);
</script>

<Datagrid />
