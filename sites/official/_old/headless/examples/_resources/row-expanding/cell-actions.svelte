<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	let {
		row,
		column,
		datagrid
	}: { row: GridBasicRow<any>; column: LeafColumn<any>; datagrid: DatagridCore<any> } = $props();

	const handleClick = () => {
		datagrid.handlers.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<div class="flex gap-2">
	<button onclick={handleClick}>
		<LayoutNavbarExpandFilled
			class={`${datagrid.features.rowExpanding.isRowExpanded(row.identifier) ? 'rotate-180' : ''} transition-all`}
		/>
	</button>
</div>
