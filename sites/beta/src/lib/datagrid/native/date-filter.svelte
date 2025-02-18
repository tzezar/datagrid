<script lang="ts">
	import { getContext } from 'svelte';
	import { updateFilter } from '../fns/update-filter';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		columnId = ''
	}: {
		columnId?: string;
	} = $props();
</script>

<input
	type="date"
	oninput={(e) =>
		( updateFilter(
			columnId,
			e.currentTarget.value,
			'date',
			datagrid
		))}
/>

<style>
	input {
		border-width: 1px;
		padding-left: 8px;
		width: 100%;
	}
</style>
