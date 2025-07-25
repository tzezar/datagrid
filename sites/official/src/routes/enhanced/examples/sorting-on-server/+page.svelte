<script lang="ts">
	import type { Sorting } from '$lib/datagrid/core/types';
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid';
	import { tick } from 'svelte';
	import type { SortingFeatureConfig } from '$lib/datagrid/core/features/sorting.svelte';
	import { getSortingFromUrl, handleServerSideSorting } from './utils';
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';

	let { data } = $props();

	class MySortingFeature extends SortingFeature {
		isManual = true;
		allowMultiSort = false;

		onSortingChange = async (config: SortingFeature) => {
			await applyServerSideSorting(config.datagrid);
		};

		constructor(datagrid: DatagridCore, config?: SortingFeatureConfig) {
			super(datagrid, config);
		}
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,
		extra: {
			title: 'Sorting on Server Example',
			features: {
				// @ts-ignore todo - typing needs to be fixed
				pagination: { position: 'none' },
				rowSelection: { position: 'none' },
				rowExpanding: { position: 'none' }
			}
		},
		initialState: {
			sorting: {
				sortConfigs: getSortingFromUrl(data.sortBy, data.sortOrder) // ? This will initialize the sorting state from the URL parameters already on the server
			}
		},
		features: {
			sorting: MySortingFeature
		}
	});

	datagrid.events.on('onColumnSort', async (column) => {
		await tick();
		await applyServerSideSorting(datagrid);
	});

	// Utility function to apply server-side sorting
	const applyServerSideSorting = async (datagrid: DatagridCore) => {
		await handleServerSideSorting(datagrid);
		datagrid.originalState.data = data.inventory;
		datagrid.cacheManager.invalidate('everything');
		datagrid.refresh(() => {}, { recalculateAll: true });
	};
</script>

<div>
	<Grid.Component {datagrid}></Grid.Component>
</div>

<pre class="pt-4">{JSON.stringify(
		$state.snapshot(datagrid.features.sorting.sortConfigs),
		null,
		2
	)}</pre>
