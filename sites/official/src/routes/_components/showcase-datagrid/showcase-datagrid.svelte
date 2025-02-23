<script lang="ts">
	import type { ColumnId, SortingDirection } from '$lib/datagrid/core/types';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid';
	import { inventoryData } from '$lib/data/data-storage.svelte';
	import RowExpandedContent from './row-expanded-content.svelte';
    import {columns} from './columns.svelte'

	class MySortingFeature extends SortingFeature {
		isManual = false;
		someExtra: string = 'Hello';

		// ovverride
		isColumnSorted(columnId: ColumnId, direction?: SortingDirection): boolean {
			console.log('How awesome!');
			return super.isColumnSorted(columnId, direction);
		}

		constructor(datagrid: DatagridCore) {
			super(datagrid);
		}
	}

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: inventoryData,
		initialState: {
			sorting: {
				sortConfigs: [{ columnId: 'name', direction: 'ascending' }]
			}
		},

		default: {
			column: {
				size: {
					width: 1000,
					minWidth: 1000,
					maxWidth: 1000
				}
			}
		}
	});

    $effect(() => {
        console.log($state.snapshot(datagrid.features.columnFaceting.getAllCategoricalFacets()))
    })

</script>
<Grid.Component {datagrid}>
	{#snippet expandedRowContent(row)}
		<RowExpandedContent {row} />
	{/snippet}
</Grid.Component>