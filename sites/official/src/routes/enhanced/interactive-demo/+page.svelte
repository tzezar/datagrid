<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,

		extra: {
			features: {
				pagination: {
					manual: true,
				},
				columnFiltering: {

				},

				clickToCopy: {
					onClickToCopy(value) {
						toast.info(`Copied ${value} to clipboard`);
					}
				},
				animations: {
					animateRows: true,
					animateHeaders: true
				},
				rowSelection: {
					onSelectMoreThanMaxSelectedRows() {
						toast.error('You reached the maximum number of selected rows');
					}
				},
				sorting: {
					enableMultiSort: true,
					enableSorting: true,
					manualSorting: false,
					maxMultiSortColCount: 2,
					isMultiSortEvent: () => true
				}
			}
		}
	});
</script>

<div>
	<!-- {@render Pagination()} -->
</div>

<Grid.Component {datagrid}></Grid.Component>

{#snippet Animations()}
<div>
	<p>Animations</p>
	<div>
	</div>
</div>
{/snippet}


{#snippet Pagination()}
<div>
	<p>Pagination</p>
	<div>
	</div>
</div>
{/snippet}