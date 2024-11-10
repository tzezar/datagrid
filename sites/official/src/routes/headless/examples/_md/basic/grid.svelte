<script lang="ts">
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import CellRenderer from '$lib/datagrid/utils/cell-renderer.svelte';
	import type { SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import ChevronLeft from '$lib/icons/chevron-left.svelte';
	import ChevronRight from '$lib/icons/chevron-right.svelte';
	import { columns } from './columns';

	let { data }: { data: SalesDataRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns
	});
</script>

<div class="grid-wrapper overflow-auto flex flex-col max-h-[600px]">
	<div class="grid-content relative flex flex-col">
		<div class="grid-header sticky top-0">
			<div class="grid-header-row">
				{#each grid.columnManager.getVisibleColumns() as column}
					<div
						class="grid-header-cell {column.align === 'end' ? 'justify-end' : ''} {column.align === 'center' ? 'justify-center' : ''} {column.align === 'start' ? 'justify-start' : ''} {column.pinning.position === 'left' ? 'offset-left bg-orange-500' : ''} {column.pinning.position === 'right' ? 'offset-right bg-orange-500' : ''}"
						style="--offset:{column.pinning.offset}px; {column.size.grow === false ? `--width:${column.size.width}px; --max-width:${column.size.width}px;` : 'flex-grow:1;'} --min-width:{column.size.minWidth}px;"
						aria-label="Click to sort column"
						role="button"
						tabindex="0"
						onclick={() => grid.reload(() => grid.sorting.toggleSort(column.columnId))}
						onkeydown={(e) => {
							if (e.key === 'Enter') grid.reload(() => grid.sorting.toggleSort(column.columnId));
							else if (e.key === 'Escape') grid.reload(() => grid.sorting.clearSort());
						}}
					>
						<div class="flex items-center gap-1">
							<span>{column.header}</span>
							{#if column.isSorted()}
								<span class="text-xs">
									{column.getSortingDirection() === 'asc' ? '▲' : 
									 column.getSortingDirection() === 'desc' ? '▼' : ' '}
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				{#if row.groupId}
					<div class="grid-row">
						{#each grid.columns as column}
							<div
								class="grid-cell overflow-hidden text-ellipsis"
								style="--offset:{column.pinning.offset}px; {column.size.grow === false ? `--width:${column.size.width}px; --max-width:${column.size.width}px;` : 'flex-grow:1;'} --min-width:{column.size.minWidth}px;"
							>
								{#if column.columnId === row.columnId && Object.keys(row.aggregates).find((key) => key === column.columnId)}
									<span>{row.groupId}</span>
								{:else if row.aggregates[column.columnId]}
									{#each Object.entries(row.aggregates[column.columnId]) as [aggKey, aggValue]}
										<span>{aggKey}: {aggValue.toFixed(2)}</span>
									{/each}
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="grid-row {grid.rowManager.isPinned(String(row?.original?.id), 'top') ? 'sticky top-0 bg-red-400' : ''}">
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class="grid-cell text-ellipsis text-nowrap {column.align === 'end' ? 'justify-end' : ''} {column.align === 'center' ? 'justify-center' : ''} {column.align === 'start' ? 'justify-start' : ''} {column.pinning.position === 'left' ? 'offset-left' : ''} {column.pinning.position === 'right' ? 'offset-right' : ''}"
								style="--offset:{column.pinning.offset}px; {column.size.grow === false ? `--width:${column.size.width}px; --max-width:${column.size.width}px;` : 'flex-grow:1;'} --min-width:{column.size.minWidth}px;"
							>
								<CellRenderer {column} {row} {grid} />
							</div>
						{/each}
					</div>
					{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
						<div class="grid-row">
							<div class="grid-cell">some content here eg lazy loaded</div>
						</div>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>

<div class="pagination grid grid-cols-2 sm:grid-cols-3 gap-[0.75rem] items-center">
	<div class="text-xs text-center sm:text-left col-span-2 sm:col-span-1 order-2 sm:order-1 hidden sm:block text-muted-foreground">
		Showing: {grid.pagination.page * grid.pagination.pageSize - grid.pagination.pageSize}
		to {grid.pagination.page * grid.pagination.pageSize} of {grid.pagination.count}
	</div>
	<div class="flex order-1 sm:order-2 gap-[0.5rem] sm:justify-center">
		<button
			class="pagination-button"
			disabled={grid.pagination.canPrevPage()}
			onclick={() => grid.refresh(() => grid.pagination.goToPrevPage())}
		>
			<ChevronLeft />
		</button>
		<input
			type="text"
			class="max-w-20"
			value={grid.pagination.page}
			onchange={(e) => {
				if (+e.currentTarget.value > 0 && +e.currentTarget.value <= grid.pagination.pageCount) {
					grid.refresh(() => grid.pagination.goToPage(Number(e.currentTarget.value)));
				} else {
					e.currentTarget.value = String(grid.pagination.page);
				}
			}}
			min="1"
		/>
		<button
			disabled={grid.pagination.canNextPage()}
			onclick={() => grid.refresh(() => grid.pagination.goToNextPage())}
		>
			<ChevronRight />
		</button>
	</div>
	<div class="flex justify-end order-1 sm:order-2">
		<select
			value={grid.pagination.pageSize}
			onchange={(e) => {
				grid.refresh(() => grid.pagination.updatePageSize(Number(e.currentTarget.value)));
			}}
		>
			{#each grid.pagination.pageSizes as pageSize}
				<option value={pageSize}>{pageSize}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.grid-content {
		background-color: hsl(var(--grid-row-even-background));
		height: 100%;
		flex-grow: 1;
	}

	.grid-header-row {
		background-color: hsl(var(--grid-header-row-background));
		display: flex;
		border: 1px solid hsl(var(--grid-border));
	}

	.grid-header-cell {
		display: flex;
		padding: 0.5rem;
		border-right: 1px solid hsl(var(--grid-border));
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
	}

	.grid-header-cell:last-child {
		border-right: none;
	}

	.grid-row {
		display: flex;
		border: 1px solid hsl(var(--grid-border));
		border-top: none;
	}

	.grid-row:last-child {
		border-bottom: none;
	}

	.grid-row:nth-child(odd) {
		background-color: hsl(var(--grid-row-odd-background));
	}

	.grid-row:hover:nth-child(odd) {
		background-color: hsl(var(--grid-row-odd-background-hover));
	}

	.grid-row:nth-child(even) {
		background-color: hsl(var(--grid-row-even-background));
	}

	.grid-row:hover:nth-child(even) {
		background-color: hsl(var(--grid-row-even-background-hover));
	}

	.grid-cell {
		display: flex;
		padding: 0.5rem;
		border-right: 1px solid hsl(var(--grid-border));
		cursor: pointer;
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
	}

	.grid-cell:last-child {
		border-right: none;
	}

	.offset-left {
		left: var(--offset);
		position: sticky;
	}

	.offset-right {
		right: var(--offset);
		position: sticky;
	}

	.pagination {
		background-color: hsl(var(--grid-header-row-background));
		padding: 0.75rem;
		border: 1px solid hsl(var(--grid-border));
	}

	

	

	.pagination-button {
		border: 1px solid hsl(var(--grid-border));
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
	}

	.pagination-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.pagination-button:hover:not(:disabled) {
		background-color: theme('colors.orange.400');
	}

	.pagination > * > button {
		border: 1px solid hsl(var(--grid-border));
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	button {
		border-radius: 0.25rem;
		padding: 0.5rem 1rem;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	button:hover:not(:disabled) {
		background-color: theme('colors.orange.400');
	}

	input {
		border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));
		padding: 0.25rem 0.5rem;
	}

	select {
		border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));

		padding: 0.25rem 0.5rem;
	}

	label {
		padding-bottom: 0.25rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
	}

</style>