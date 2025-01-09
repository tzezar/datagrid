<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow, GridRow } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';

	let { row, datagrid }: { row: GridBasicRow<any>; datagrid: DataGrid<any> } = $props();

	const handleClick = () => {
		datagrid.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<button onclick={handleClick}>
	<LayoutNavbarExpandFilled class={`${datagrid.rowExpanding.isRowExpanded(row.identifier) ? 'rotate-180' : ''} transition-all`} />
</button>
