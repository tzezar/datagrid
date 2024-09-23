<script lang="ts">
	import { getContext } from 'svelte';
	import { selectRow } from './fns/select-row';
	import { cn } from '$lib/utils';
	import { isRowIdInSelectedRowsSet } from './fns/is-row-id-in-selected-rows-set';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');

	let {
		row,
		class: _class
	}: {
		row: any;
		class?: {
			wrapper?: string;
			input?: string;
		};
	} = $props();

	// there is performace drawback when checking if input is checked with lots of selected rows 10k+
	// this slows down pagination and other features
	// storing just ids in set solves it

	// rendering checkbox from shadcn is slow
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<button class={cn('h-full w-full grow', _class?.wrapper)} onclick={() => selectRow(row, datagrid)}>
	<input
		type="checkbox"
		class={cn(_class?.input)}
		checked={isRowIdInSelectedRowsSet(row.id, datagrid.internal.selectedRowIds)}
	/>
</button>
