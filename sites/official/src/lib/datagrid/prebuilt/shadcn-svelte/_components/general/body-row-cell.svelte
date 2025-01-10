<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { cn } from '$lib/utils';
	import type { ColumnMeta, TzezarsDatagrid } from '../../types';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any, ColumnMeta>;
		row: GridBasicRow<any>;
		class?: string,
	};

	let { datagrid, column, row, class: _class = '' }: Props = $props();
</script>

<div
	class={cn('grid-body-cell', column._meta.styles?.bodyCell, datagrid.extra.highlightSelectedRow && datagrid.rowSelection.isRowSelected(row.identifier) ? 'bg-blue-400/10' : '', _class)}
	class:justify-center={column?._meta?.align === 'center'}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{#if column.cell}
		{@const cellContent = column.cell({ datagrid, column, row })}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else}
		{@html getCellContent(column, row.original)}
	{/if}
</div>
