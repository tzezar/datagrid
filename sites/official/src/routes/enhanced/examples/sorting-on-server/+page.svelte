<script lang="ts">
	import type { Sorting } from '$lib/datagrid/core/types';
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { SortingFeatureConfig } from '$lib/datagrid/core/features/sorting.svelte';

	let { data } = $props();

	class MySortingFeature extends SortingFeature {
		isManual = true;
		allowMultiSort = false;

		onSortingChange = async (config: SortingFeature) => {
			// ? This might be later on added to the core as a utility function
			// ? if you do a lot of server-side sorting this might be placed in a utility function for now

			const sortings = config.datagrid.features.sorting.sortConfigs;

			type Sorting = { columnId: string; direction: string | null };
			type ValidSorting = { columnId: string; direction: 'asc' | 'desc' };

			function isValidSorting(sort: Sorting | undefined | null): sort is ValidSorting {
				return !!sort && (sort.direction === 'asc' || sort.direction === 'desc');
			}

			const mappedSortings: ValidSorting[] = sortings
				.map((sort): Sorting | undefined => {
					let columnId = sort.columnId;
					let direction: string | null;

					if (sort.direction === 'ascending') {
						direction = 'asc';
					} else if (sort.direction === 'descending') {
						direction = 'desc';
					} else {
						return undefined;
					}

					return {
						columnId,
						direction
					};
				})
				.filter(isValidSorting);

			const url = new URL(window.location.href);

			const mappedSorting = mappedSortings[0];
			if (!mappedSorting) {
				url.searchParams.delete('sortBy');
				url.searchParams.delete('sortOrder');
			} else {
				url.searchParams.set('sortBy', mappedSorting.columnId);
				url.searchParams.set('sortOrder', mappedSorting.direction);
			}

			// Update URL to trigger server-side load with new sorting parameters
			await goto(url.pathname + '?' + url.searchParams.toString(), { replaceState: true });

			// Refresh the datagrid with the new data from the server
			datagrid.originalState.data = data.inventory;
			datagrid.cacheManager.invalidate('everything');
			datagrid.refresh(() => {}, { recalculateAll: true });
		};

		constructor(datagrid: DatagridCore, config?: SortingFeatureConfig) {
			super(datagrid, config);
		}
	}

	// Initialize datagrid with sorting state from URL
	// ? It might be also possible to set the initial state onMount if you fetch the data on the client side
	const initialSortConfigs: Sorting[] = [];
	const sortBy = data.sortBy;
	const sortOrder = data.sortOrder;
	if (sortBy && sortOrder) {
		initialSortConfigs.push({
			columnId: sortBy,
			direction: sortOrder === 'asc' ? 'ascending' : 'descending'
		});
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
				sortConfigs: initialSortConfigs // ? This will initialize the sorting state from the URL parameters already on the server
			}
		},
		features: {
			sorting: MySortingFeature
		}
	});
</script>

<div>
	<Grid.Component {datagrid}></Grid.Component>
</div>

<pre class='pt-4'>{JSON.stringify($state.snapshot(datagrid.features.sorting.sortConfigs), null, 2)}</pre>
