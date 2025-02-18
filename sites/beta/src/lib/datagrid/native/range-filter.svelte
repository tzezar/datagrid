<script lang="ts">
	import { getContext } from 'svelte';
	import { updateFilter } from '../fns/update-filter';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import type { ColumnId } from '../types';
	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		column,
		columnId = ''
	}: {
		column: any;
		columnId?: ColumnId;
	} = $props();

	function handleMinChange(event: any) {
		const minValue = +event.currentTarget?.value || -99999999999;

		// Check if state.filters exist and value is a range (array of numbers)
		const existingFilter = datagrid.state.filters.find((f) => f.columnId === columnId);
		const maxValue = (
			Array.isArray(existingFilter?.value) ? existingFilter.value[1] : column.filterValue[1]
		) as number;

		updateFilter(columnId, [minValue, maxValue], 'range', datagrid);
	}

	function handleMaxChange(event: any) {
		const maxValue = +event.currentTarget?.value || 9999999999999;

		// Check if state.filters exist and value is a range (array of numbers)
		const existingFilter = datagrid.state.filters.find((f) => f.columnId === columnId);
		const minValue = (
			Array.isArray(existingFilter?.value) ? existingFilter.value[0] : column.filterValue[0]
		) as number;

		updateFilter(columnId, [minValue, maxValue], 'range', datagrid);
	}
</script>

<div class="flex max-w-[150px] flex-row gap-2">
	<input type="text" placeholder="min" oninput={(e) => handleMinChange(e)} />
	<input type="text" placeholder="max" oninput={(e) => handleMaxChange(e)} />
</div>

<style>
	input {
		border-width: 1px;
		padding-left: 8px;
		width: 100%;
	}
</style>
