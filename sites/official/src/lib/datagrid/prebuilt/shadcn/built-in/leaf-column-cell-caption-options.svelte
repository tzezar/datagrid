<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/built-in/column-sorting-indicator.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-dropdown.svelte';

	type Props = {
		column: LeafColumn<any>;
		datagrid: TzezarsDatagrid;
	};
	let { column, datagrid }: Props = $props();

	function shouldShowColumnOptionsDropdown(column: LeafColumn<any>): boolean {
		return column._meta.showColumnOptionsDropdownMenu === true;
	}
</script>

<div class="flex gap-1">
	{#if column.isSortable()}
		<ColumnSortingIndicator {datagrid} {column} />
	{/if}
	{#if shouldShowColumnOptionsDropdown(column)}
		<HeaderCellDropdown {datagrid} {column} />
	{/if}
</div>
