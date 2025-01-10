<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';
	import type { ColumnMeta, TzezarsDatagrid } from '../../types';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any, ColumnMeta>;
		onclick?: (e: any) => void;
		children: Snippet;
	};
	let { datagrid, column, onclick, children }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="grid-header-cell-content items-end {column.options.sortable ? 'sortable' : ''}"
	onclick={(e) => datagrid.handlers.sorting.toggleColumnSorting(column, e)}
>
	{@render children()}
</div>
