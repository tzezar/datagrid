<script lang="ts">
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	
	import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import ColumnFilter from '$lib/datagrid/prebuilt/native/column-filter.svelte';
	import HeaderCellDropdown from './header-cell-dropdown.svelte';
	import HeaderCell from './header-cell.svelte';
	import SortingIndicator from './sorting-indicator.svelte';

	let { datagrid, column }: { datagrid: Datagrid<any>; column: any } = $props();

	function hasVisibleChildren(column: any): boolean {
		if (!isGroupColumn(column)) return false;
		return column.columns.some((col: any) => {
			if (isGroupColumn(col)) {
				return hasVisibleChildren(col);
			}
			return col.state.visible === true;
		});
	}
</script>

{#snippet HeaderGroupCell(column: GroupColumn<any>)}
	<div
		class={`grid-header-group text-xs font-medium `}
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	>
		{#if hasVisibleChildren(column)}
			<div class="grid-header-group-header box-border text-center">{column.header}</div>
			<div class="flex grow flex-row">
				{#each column.columns ?? [] as subColumn (subColumn.columnId)}
					<HeaderCell {datagrid} column={subColumn} />
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet HeaderCellSnippet(column: LeafColumn<any>)}
	<div
		class={`grid-header-cell h-fit justify-end self-end border-t text-xs font-medium`}
		data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
		style:--pin-left-offset={column.state.pinning.offset + 'px'}
		style:--pin-right-offset={column.state.pinning.offset + 'px'}
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="grid-header-cell-content items-end {column.options.sortable ? 'sortable' : ''}"
			onclick={(e) => datagrid.handlers.sorting.toggleColumnSorting(column, e)}
		>
			{#if column.headerCell}
				{@const cellContent = column.headerCell({ datagrid, column })}
				{#if typeof cellContent === 'string'}
					{@html cellContent}
				{:else if isCellComponent(cellContent)}
					<cellContent.component {datagrid} {column} />
				{/if}
			{:else}
				<span class="grid-header-cell-content-header">{column.header}</span>
			{/if}
			<div class="flex gap-1">
				{#if column.options.sortable}
					<SortingIndicator {datagrid} {column} />
				{/if}
				{#if column.options.showDropdownOptions}
					<HeaderCellDropdown {datagrid} {column} />
				{/if}
			</div>
		</div>
		{#if datagrid.filtering.showColumnFiltering}
			<div class="h-9 w-full pt-1">
				<ColumnFilter {datagrid} {column} />
			</div>
		{/if}
	</div>
{/snippet}

{#if isGroupColumn(column)}
	{@render HeaderGroupCell(column)}
{:else if column.state.visible === true}
	{@render HeaderCellSnippet(column)}
{/if}

<style>
	.test {
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box; /* Opera/IE 8+ */
	}
</style>
