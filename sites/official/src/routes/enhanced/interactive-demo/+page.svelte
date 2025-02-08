<script lang="ts">
	import type { Sorting } from '$lib/datagrid/core/types';

	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';

	let { data } = $props();

	class CustomSortingFeature extends SortingFeature {
		sortConfigs: Sorting[] = $state([
			{
				columnId: 'name',
				direction: 'desc'
			}
		]) as Sorting[];
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,

		features: {
			sorting: CustomSortingFeature
		},
	});

	datagrid.events.on('toggleSort', (data) => {
		console.log('About to sort column:', data.column.columnId);
	});

</script>

<div class="pb-20">
	<!-- <PaginationControl {datagrid} />
	<RowSelectionControl {datagrid} />
	<RowExpandingControl {datagrid} />
	<ControlCenterControl {datagrid} /> -->
</div>

<Grid.Component {datagrid}></Grid.Component>

{#snippet Animations()}
	<div>
		<p>Animations</p>
		<div></div>
	</div>
{/snippet}
