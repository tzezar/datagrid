<script lang="ts">
	import { getContext } from 'svelte';
	import { updateFilter } from '../fns/update-filter';
	import { Input } from '$lib/components/ui/input';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import type { ColumnId } from '../types';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		columnId = ''
	}: {
		columnId?: ColumnId;
	} = $props();
</script>

<input
	type="number"
	oninput={(e) => {
		 updateFilter(
			columnId,
			e.currentTarget.value,
			'number',
			datagrid
		);
	}}
/>

<style>
	input {
		border-width: 1px;
		padding-left: 8px;
		width: 100%;
	}
</style>
