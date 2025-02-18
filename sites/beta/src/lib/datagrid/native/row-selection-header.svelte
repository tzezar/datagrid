<script lang="ts" generics="T">
	import { getContext } from 'svelte';
	import { handleSelectionChange } from '../fns/handle-row-selection-change';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');

	let {}: {} = $props();

	let selectedValue = $state('hidden');
</script>

<div class="flex w-full justify-center">
	<select
		class="mt-4 w-[20px] border"
		bind:value={selectedValue}
		onchange={(e) => {
			datagrid.selectedRows = handleSelectionChange(
				e,
				datagrid.data,
				datagrid.selectedRows,
				datagrid.paginatedData
			);
			selectedValue = 'hidden';
		}}
	>
		<option value="all">Select all</option>
		<option value="none">Unselect all</option>
		<option value="allOnPage">Select all on page</option>
		<option value="noneOnPage">Unselect all on page</option>
		<option value="hidden" hidden selected>Select all on page</option>
	</select>
</div>
