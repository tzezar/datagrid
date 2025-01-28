<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import ContentCopyOutline from '$lib/datagrid/icons/material-symbols/content-copy-outline.svelte';
	import Cell from './cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
		children?: Snippet;
	};

	let { datagrid, row, column, children }: Props = $props();
</script>

{#if column.isVisible()}
	{#if column.cell}
		{@const cellContent = column.cell({ datagrid, column, row })}
		{#if typeof column.cell({ datagrid, column, row }) === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else if children}
		{@render children()}
	{:else}
		<Cell {datagrid} {row} {column}>
			<span class={datagrid.extra.features.customization.getBodyRowCellContentClasses()}>
				{@html getCellContent(column, row.original)}
			</span>

			{@render CopyCellButton(column, row)}
		</Cell>
	{/if}
{/if}

{#snippet CopyCellButton(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{#if datagrid.extra.features.clickToCopy.isValidColumn(column)}
		{#if datagrid.extra.features.clickToCopy.shouldDisplayCopyButton(column)}
			<button
				class="pl-1"
				onclick={(e) => {
					datagrid.extra.features.clickToCopy.handleClickToCopy(row.original, column);

					const cellElement = (e.target as HTMLElement).closest('.cell');
					if (cellElement) {
						datagrid.extra.features.clickToCopy.addCopyFeedback(cellElement as HTMLElement);
					}
				}}
			>
				<ContentCopyOutline
					width="0.75rem"
					class={cn('hidden opacity-0 transition-all group-hover:block group-hover:opacity-100')}
				/>
			</button>
		{/if}
	{/if}
{/snippet}
