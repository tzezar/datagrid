<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import type { ColumnMetaEnhanced } from '../core/types';
	import ColumnSortingIndicator from './column-sorting-indicator.svelte';
	import HeaderCellDropdown from './header-cell-dropdown.svelte';

	type Props = {
		column: LeafColumn<any, ColumnMetaEnhanced>;
		datagrid: EnhancedDatagrid;
	};
	let { column, datagrid }: Props = $props();

	function shouldShowColumnOptionsDropdown(column: LeafColumn<any, ColumnMetaEnhanced>): boolean {
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
