<script lang="ts">
	import type { Datagrid } from './datagrid/core/index.svelte';
	import type { GridRow } from './datagrid/core/types';

	let props: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();

	const handleClick = () => {
		props.datagrid.rowExpanding.toggleRowExpansion(props.row.index);
	};
</script>

<button onclick={handleClick}>expand</button>
