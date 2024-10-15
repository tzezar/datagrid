<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { BaseColumn } from './types';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {
		columnIndex,
		rowIndex,
		column,
		children,
		row,
		class: _class
	}: {
		columnIndex: number;
		rowIndex: number;
		column: BaseColumn;
		row: any;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

{#if column.visible !== false}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		data-row={rowIndex}
		data-column={columnIndex}
		tabindex="0"
		class={cn(
			'flex flex-shrink-0  border-r leading-none last:border-r-0 overflow-hidden',
			column.pinned?.position == 'left' && 'offset-left border-r  ',
			column.pinned?.position == 'right' && 'offset-right  border-l  ',
			datagrid.options.rows.striped && rowIndex % 2 === 1
				? 'bg-table-row-odd group-hover/row:bg-table-row-odd-hover'
				: 'bg-table-row-even group-hover/row:bg-table-row-even-hover',
			_class
		)}
		style:--offset={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:--offset-right={column.pinned?.offset ? column.pinned.offset : '0px'}
		style:width={column.width || datagrid.options.defaultColumnWidth}
		class:grow={column.grow}
		style={`${column.align === 'start' ? 'justify-content: flex-start;' : column.align === 'center' ? 'justify-content: center;' : column.align === 'end' ? 'justify-content: flex-end;' : ''}`}
	>
		{#if children}
			{@render children()}
		{:else}
			<span class="overflow-hidden text-ellipsis text-nowrap">{row[column.id]}</span>
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

	.grow {
		flex-grow: 1;
	}
</style>
