<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { isColumnSortable } from '$lib/datagrid/core/utils.svelte';
	import type { TzezarsDatagrid } from '../types';
	import HeaderCellDropdown from './header-cell-dropdown.svelte';
	import SortingIndicator from './sorting-indicator.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any>;
	};

	let { datagrid, column }: Props = $props();


</script>

<div class="flex gap-1">
	{#if isColumnSortable(column)}
		<SortingIndicator {datagrid} {column} />
	{/if}
	{#if column._meta.showColumnManagerDropdownMenu === true}
		<HeaderCellDropdown {datagrid} {column} />
	{/if}
</div>
