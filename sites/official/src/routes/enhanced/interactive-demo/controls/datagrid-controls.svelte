<script lang="ts">
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';
	import ControlCenterControl from './control-center-control.svelte';
	import PaginationControl from './pagination-control.svelte';
	import RowExpandingControl from './row-expanding-control.svelte';
	import RowSelectionControl from './row-selection-control.svelte';

	let { datagrid }: { datagrid: EnhancedDatagrid } = $props();
</script>

<div class=''>
	<ControlCenterControl {datagrid} />
	<!-- <PaginationControl {datagrid} /> -->
	<!-- <RowExpandingControl {datagrid} /> -->
	<!-- <RowSelectionControl {datagrid} /> -->
</div>
