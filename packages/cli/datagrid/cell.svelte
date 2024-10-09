<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { BaseColumn } from './types';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { getNestedValue } from './fns/get-nested-value';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		custom,
		class: _class,
		columnIndex,
		rowIndex,
		column,
		row,
	}: {
		columnIndex: number;
		rowIndex: number;
		column: BaseColumn;
		row: any;
		custom?: Snippet;
		class?: {
			cell?: string;
			data?: string;
		};
	} = $props();
</script>

{#if column.visible !== false}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		data-row={rowIndex}
		data-column={columnIndex}
		tabindex="0"
		onfocus={() => {
			datagrid.internal.keyboardNavigation.focusedRowIndex = rowIndex;
			datagrid.internal.keyboardNavigation.focusedColumnIndex = columnIndex;
		}}
		style:--offset={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:--offset-right={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:width={column.width || '100px'}
		style:padding-top={datagrid.options.spacing.selected.vertical}
		style:padding-bottom={datagrid.options.spacing.selected.vertical}
		style:padding-left={datagrid.options.spacing.selected.horizontal}
		style:padding-right={datagrid.options.spacing.selected.horizontal}
		style={`${column.align === 'start' ? 'justify-content: flex-start;' : column.align === 'center' ? 'justify-content: center;' : column.align === 'end' ? 'justify-content: flex-end;' : ''}`}
		class={cn(
			'flex min-h-fit items-center border-r  leading-none last:border-r-0 ',
			column.pinned?.position == 'left' && 'offset-left border-r',
			column.pinned?.position == 'right' && 'offset-right border-l',
			datagrid.options.rows.striped &&
				rowIndex % 2 === 1 &&
				'bg-table-row-odd group-hover/row:bg-table-row-odd-hover',
			datagrid.options.rows.striped &&
				rowIndex % 2 === 0 &&
				'bg-table-row-even group-hover/row:bg-table-row-even-hover',
			column.grow && 'grow',
			_class?.cell
		)}
	>
		{#if custom}
			{@render custom()}
		{:else}
			<span class={cn(_class?.data)}>
				{getNestedValue(row, column.id)}
			</span>
		{/if}
	</div>
{/if}

<style>
	.offset-left {
		left: var(--offset);
		position: sticky;
	}

	.offset-right {
		right: var(--offset-right);
		position: sticky;
	}
</style>
