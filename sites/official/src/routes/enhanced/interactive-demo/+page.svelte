<script lang="ts">
	import type { ColumnId, SortingDirection } from '$lib/datagrid/core/types';

	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import DatagridControls from './controls/datagrid-controls.svelte';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid';

	let { data } = $props();

	class MySortingFeature extends SortingFeature {
		isManual = false
		someExtra: string = 'Hello'

		// ovverride
		isColumnSorted(columnId: ColumnId, direction?: SortingDirection): boolean {
			console.log('How awesome!')
			return super.isColumnSorted(columnId, direction)
		}

		constructor(datagrid: DatagridCore) {
			super(datagrid)
		}
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,
		initialState: {
			sorting: {
				sortConfigs: [{ columnId: 'name', direction: 'ascending' }]
			}
		}
	});

	datagrid.events.on('onColumnSort', ({column}) => {
		console.log('onColumnSort', column)
	})

</script>

<div>

	<Grid.Component {datagrid}></Grid.Component>
	<DatagridControls {datagrid} />
</div>
