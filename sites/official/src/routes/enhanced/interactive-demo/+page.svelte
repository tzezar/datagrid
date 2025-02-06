<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { columns } from './columns.svelte';
	import * as Grid from '$lib/datagrid-enhanced';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';

	let { data } = $props();

	let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
		columns,
		data: data.inventory,

		extra: {
			features: {
				clickToCopy: {
					onClickToCopy(value) {
						toast.info(`Copied ${value} to clipboard`);
					}
				},
				animations: {
					animateRows: true,
					animateHeaders: true
				},
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