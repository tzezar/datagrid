<script lang="ts">
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import {
		getSortDirection,
		getSortIcon,
		getSortIndex,
		onSort
	} from '$lib/datagrid/core/utils.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import ColumnFilter from '$lib/datagrid/prebuilt/native/column-filter.svelte';
	import HeaderCell from './header-cell.svelte';

	let { datagrid, column }: { datagrid: Datagrid<any>; column: any } = $props();

	// Find the deepest level of any column in the grid
	function findMaxDepth(columns: any[]): number {
		let maxDepth = 0;

		function traverse(col: any, depth: number) {
			if (isGroupColumn(col)) {
				col.columns.forEach((subCol) => traverse(subCol, depth + 1));
			} else {
				maxDepth = Math.max(maxDepth, depth);
			}
		}

		columns.forEach((col) => traverse(col, 0));
		return maxDepth;
	}

	// Calculate current column's depth
	function getColumnDepth(targetCol: any): number {
		let depth = 0;

		function findColumn(columns: any[], currentDepth: number): boolean {
			for (const col of columns) {
				if (col === targetCol) {
					depth = currentDepth;
					return true;
				}
				if (isGroupColumn(col)) {
					if (findColumn(col.columns, currentDepth + 1)) {
						return true;
					}
				}
			}
			return false;
		}

		findColumn(datagrid.columns, 0);
		return depth;
	}

	// Check if any child column is visible
	function hasVisibleChildren(column: any): boolean {
		if (!isGroupColumn(column)) return false;
		return column.columns.some((col: any) => {
			if (isGroupColumn(col)) {
				return hasVisibleChildren(col);
			}
			return col.state.visible === true;
		});
	}

	let maxGridDepth = $state(findMaxDepth(datagrid.columns))
	let currentDepth = $state(getColumnDepth(column))
	let blankCellsCount = $state(!isGroupColumn(column) ? maxGridDepth - currentDepth : 0)
</script>

{#if isGroupColumn(column)}
	<div
		class="grid-header-group text-xs font-medium"
		style:--width={column.state?.size?.width + 'px'}
		style:--min-width={column.state?.size?.minWidth + 'px'}
		style:--max-width={column.state?.size?.maxWidth + 'px'}
	>
		{#if hasVisibleChildren(column)}
			<div class="grid-header-group-header border-b px-2 py-1 text-center">{column.header}</div>
			<div class="flex grow flex-row">
				{#each column.columns ?? [] as subColumn (subColumn.columnId)}
					<HeaderCell {datagrid} column={subColumn} />
				{/each}
			</div>
		{/if}
	</div>
{:else if column.state.visible === true}
	<div class="flex flex-col">
		{#each Array(blankCellsCount) as _, i}
			<div class="grid-header-group grow-0 border-b border-r"></div>
		{/each}
		<div
			class="grid-header-cell text-xs font-medium"
			data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
			style:--pin-left-offset={column.state.pinning.offset + 'px'}
			style:--pin-right-offset={column.state.pinning.offset + 'px'}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<div
				class="grid-header-cell-content {column.options.sortable ? 'sortable' : ''}"
				onclick={(e) => onSort(datagrid, column, e)}
			>
				<span class="grid-header-cell-content-header">{column.header}</span>
				{#if column.options.sortable}
					<div class="sort-indicator">
						{#if getSortDirection(datagrid, column) === 'desc'}
							<SortDescending />
						{:else if getSortDirection(datagrid, column) === 'asc'}
							<SortAscending />
						{:else if getSortDirection(datagrid, column) === 'intermediate'}
							<ArrowsSort />
						{/if}
						{#if getSortIndex(datagrid, column)}
							<span class="text-xs">{getSortIndex(datagrid, column)}</span>
						{/if}
					</div>
				{/if}
			</div>
			{#if datagrid.filtering.showColumnFiltering}
				<div class="h-6 w-full pt-1">
					<ColumnFilter {datagrid} {column} />
				</div>
			{/if}
		</div>
	</div>
{/if}