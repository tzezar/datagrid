<script lang="ts">
	import type { ColumnId, SortingDirection } from '$lib/datagrid/core/types';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { SortingFeature } from '$lib/datagrid/core/features';
	import type { DatagridCore } from '$lib/datagrid';
	import { inventoryData, preGeneratedInventory } from '$lib/data/data-storage.svelte';
	import RowExpandedContent from './row-expanded-content.svelte';
    import {columns} from './columns.svelte'
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

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
		data: preGeneratedInventory,
		initialState: {
			sorting: {
				sortConfigs: [{ columnId: 'name', direction: 'ascending' }]
			}
		},

		default: {
			column: {
				size: {
					width: 100,
					minWidth: 40,
					maxWidth: 500
				}
			}
		}
	});

</script>
<Grid.Component {datagrid}>
	{#snippet expandedRowContent(row)}
		<RowExpandedContent {row} />
	{/snippet}
</Grid.Component>