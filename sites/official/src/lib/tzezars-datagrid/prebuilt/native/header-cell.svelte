<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';
	import type { Snippet } from 'svelte';
	import ColumnFilter from './_components/column-filter.svelte';

	let {
		children,
		column,
		grid
	}: { children?: Snippet; column: Column<any>; grid: Datagrid<any, any> } = $props();
</script>

<div
	class="grid-header-cell"
	style="{column.size.grow === false
		? `--width:${column.size.width}px; --max-width:${column.size.width}px;`
		: 'flex-grow:1;'} --min-width:{column.size.minWidth}px; 
							{['left', 'right'].includes(column.pinning.position) && `background-color: black;`}
							"
	class:offset-left={column.pinning.position === 'left'}
	class:offset-right={column.pinning.position === 'right'}
	style:--offset={`${column.pinning.offset}px`}
>
	<div
		aria-label="Click to sort column"
		role="button"
		tabindex="0"
		class="flex w-full items-center gap-1 overflow-hidden"
		class:justify-end={column.align === 'end'}
		class:justify-center={column.align === 'center'}
		class:justify-start={column.align === 'start'}
		onclick={() => {
			if (column.sortable === false) return;
			grid.reload(() => grid.sorting.toggleSort(column.columnId));
		}}
		onkeydown={(e) => {
			if (column.sortable === false) return;
			if (e.key === 'Enter') grid.reload(() => grid.sorting.toggleSort(column.columnId));
			else if (e.key === 'Escape') grid.reload(() => grid.sorting.clearSort());
		}}
	>
		<span class="overflow-hidden text-ellipsis">{column.header}</span>
		{#if column.isSorted()}
			<span class="text-nowrap text-xs">
				{column.getSortingDirection() === 'asc'
					? `▲ ${grid.sorting.getColumnSortPosition(column)}`
					: column.getSortingDirection() === 'desc'
						? `▼ ${grid.sorting.getColumnSortPosition(column)}`
						: ' '}
			</span>
		{/if}
	</div>
	{#if grid.columnManager.isFilterable(column)}
		<ColumnFilter {column} {grid} />
	{/if}
</div>
