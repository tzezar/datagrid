<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import ContentCopyOutline from '$lib/datagrid/icons/material-symbols/content-copy-outline.svelte';
	import Cell from './cell.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { EnhancedColumnMeta } from '../core/types';
	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		column: LeafColumn<any, EnhancedColumnMeta>;
		children?: Snippet;
	};

	let { datagrid, row, column, children }: Props = $props();
</script>

{#if column.isVisible()}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	{@const shouldShowTooltips = datagrid.customization.cellTooltips}
	{@const cellClasses = datagrid.customization.styling.getBodyRowCellContentClasses()}

	{#if cellContent}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else if children}
		{@render children()}
	{:else}
		<Cell {datagrid} {row} {column}>
			{#if shouldShowTooltips && column._meta?.tooltip !== false}
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger class="w-full overflow-hidden text-ellipsis text-left">
							<span class={cellClasses}>
								{@html getCellContent(column, row.original)}
							</span>
						</Tooltip.Trigger>
						<Tooltip.Content side="top" align="start">
							{@html getCellContent(column, row.original)}
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			{:else}
				<span class={cellClasses}>
					{@html getCellContent(column, row.original)}
				</span>
			{/if}
			{@render CopyCellButton(column, row)}
		</Cell>
	{/if}
{/if}

{#snippet CopyCellButton(column: LeafColumn<any, EnhancedColumnMeta>, row: GridBasicRow<any>)}
	{#if datagrid.extra.features.clickToCopy.isValidColumn(column)}
		{#if datagrid.extra.features.clickToCopy.shouldDisplayCopyButton(column)}
			<button
				class="pl-1"
				onclick={(e) => {
					datagrid.extra.features.clickToCopy.handleClickToCopy(row.original, column);

					const cellElement = (e.target as HTMLElement).closest('.grid-body-row-cell');
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
