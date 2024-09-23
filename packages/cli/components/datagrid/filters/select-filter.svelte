<script lang="ts">
	import { getContext } from 'svelte';
	import { updateFilter } from '../fns/update-filter';
	import type { ColumnId } from '../types';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		options,
		field = ''
	}: {
		options: {
			value: string;
			label: string;
		}[];
		field?: ColumnId;
	} = $props();
</script>

<select onchange={(e) => updateFilter(field, e.currentTarget.value, 'string', datagrid)}>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	select {
		border-width: 1px;
		padding-left: 8px;
		width: 100%;
	}
</style>
