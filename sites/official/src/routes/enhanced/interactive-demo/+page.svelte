<script lang="ts">
	import type { OnPageChangePayload, Sorting } from '$lib/datagrid/core/types';

	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';

	let { data } = $props();

	class CustomSortingFeature extends SortingFeature {
		sortConfigs: Sorting[] = $state([
			{
				columnId: 'name',
				direction: 'descending'
			}
		]) as Sorting[];
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,

		// measurePerformance: true,

		features: {
			sorting: CustomSortingFeature
		}
	});

	// datagrid.events.on('onPageChange', (data) => {
	// 	console.log(data.prevPage); // This will be strongly typed based on the `OnPageChangePayload` type
	// });
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
