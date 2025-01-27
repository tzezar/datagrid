<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';

	type Props = {
		column: LeafColumn<any>;
		datagrid: any;
		children: Snippet;

	};
	let { column, datagrid, children}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="grid-header-cell-content {column.options.sortable ? 'sortable' : ''}"
	onclick={(e) => {
		const multisort = e.shiftKey;
		datagrid.handlers.sorting.toggleColumnSorting(column, multisort);
	}}
>		
	{@render children()}
</div>
