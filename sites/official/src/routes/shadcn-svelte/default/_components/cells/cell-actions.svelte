<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	import BodyRowCellRowActions from '$lib/datagrid/prebuilt/shadcn-svelte/_components/body-row-cell-row-actions.svelte';

	let {
		row,
		column,
		datagrid
	}: { row: GridBasicRow<any>; column: LeafColumn<any>; datagrid: DataGrid<any> } = $props();

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
	<BodyRowCellRowActions {row} {column} {datagrid} />
</div>
