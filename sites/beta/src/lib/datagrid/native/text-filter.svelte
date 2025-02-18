<script lang="ts">
	import { getContext } from 'svelte';
	import { updateFilter } from '../fns/update-filter';
	import type { ColumnId } from '../types';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';

	let {
		columnId = ''
	}: {
		columnId?: ColumnId;
	} = $props();

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<input
	type="text"
	oninput={(e) =>
		 updateFilter(
			columnId,
			e.currentTarget.value,
			'string',
			datagrid
		)}
/>

<style>
	input {
		border-width: 1px;
		padding-left: 8px;
		width: 100%;
	}
</style>
