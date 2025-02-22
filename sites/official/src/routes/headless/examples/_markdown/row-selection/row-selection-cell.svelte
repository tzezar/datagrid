<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';

	type Props = {
		datagrid: DatagridCore<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={() => datagrid.handlers.rows.toggleRowSelection(row.identifier)}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	class={cn(
		'td gap-2 px-4 py-2 ',
		column._meta.grow && '!max-w-full !grow',
		datagrid.features.rowSelection.isRowSelected(row.identifier) ? '!bg-blue-500/20' : ''
	)}
>
	<input
		type="checkbox"
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		class="h-full w-full"
	/>
</div>

<style>
	.td {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
	}

	.td {
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
