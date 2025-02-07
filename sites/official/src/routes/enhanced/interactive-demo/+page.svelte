<script lang="ts">
	import type { Sorting } from '$lib/datagrid/core/types';

	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import PaginationControl from './controls/pagination-control.svelte';
	import RowSelectionControl from './controls/row-selection-control.svelte';
	import RowExpandingControl from './controls/row-expanding-control.svelte';
	import ControlCenterControl from './controls/control-center-control.svelte';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { SortingFeatureConfig } from '$lib/datagrid/core/features/sorting.svelte';

	let { data } = $props();

	class CustomSortingFeature extends SortingFeature {
		sortConfigs: Sorting[] = $state([
			{
				columnId: 'id',
				desc: true
			}
		])
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,

		features: {
			sorting: CustomSortingFeature
		},
		initialState: {
			globalSearch: {
				searchQuery: 'Pants'
			}
		}


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
