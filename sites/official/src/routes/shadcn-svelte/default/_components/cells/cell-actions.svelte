<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { GridRow } from '$lib/datagrid/core/types';
	import FreezeRow from '$lib/datagrid/icons/tabler/freeze-row.svelte';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';

	let { row, datagrid }: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();

	const handleClick = () => {
		datagrid.rowExpanding.toggleRowExpansion(row.index);
	};
</script>

<button onclick={handleClick}>
	<LayoutNavbarExpandFilled class={`${datagrid.rowExpanding.isRowExpanded(row.index) ? 'rotate-180' : ''} transition-all`} />
	
</button>
