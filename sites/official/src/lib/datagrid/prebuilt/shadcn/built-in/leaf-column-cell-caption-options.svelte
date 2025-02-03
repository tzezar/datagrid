<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/built-in/column-sorting-indicator.svelte';
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/built-in/header-cell-dropdown.svelte';
	import type { ShadcnColumnMeta } from '../core/types';

	type Props = {
		column: LeafColumn<any, ShadcnColumnMeta>;
		datagrid: TzezarsDatagrid;
	};
	let { column, datagrid }: Props = $props();

	function shouldShowColumnOptionsDropdown(column: LeafColumn<any, ShadcnColumnMeta>): boolean {
		return column._meta.showColumnManagerDropdownMenu === true;
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
