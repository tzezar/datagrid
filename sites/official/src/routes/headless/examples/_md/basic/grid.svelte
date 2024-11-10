<script lang="ts">
	import { Datagrid } from '$lib/datagrid/index.svelte';
	import CellRenderer from '$lib/datagrid/utils/cell-renderer.svelte';
	import type { SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import { columns } from './columns';

	let { data }: { data: SalesDataRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns
	});
</script>

<div class="grid-wrapper overflow-auto">
	<div class="grid max-h-[600px]">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each grid.columnManager.getVisibleColumns() as column}
					<div
						class={`grid-header-cell flex cursor-pointer flex-col ${column.pinning.position === 'left' && 'offset-left bg-orange-500'} ${column.pinning.position === 'right' && 'offset-right bg-orange-500'}`}
						style:--offset={column.pinning.offset + 'px'}
						style={`${column.size.grow === false ? `--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'};`: `flex-grow: 1;`};  --min-width: ${column.size.width + 'px'};`}

					>
						<div class="flex flex-row justify-center items-center">
							<span
								aria-label="Click to sort column"
								tabindex="0"
								role="button"
								class="grow flex-nowrap overflow-hidden text-ellipsis text-nowrap"
								onclick={(e) => {
									if (e.currentTarget === e.target) {
										e.stopPropagation();
										grid.reload(() => grid.sorting.toggleSort(column.columnId));
									}
								}}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.stopPropagation();
										grid.reload(() => grid.sorting.toggleSort(column.columnId));
									} else if (e.key === 'Escape') {
										grid.reload(() => grid.sorting.clearSort());
									}
								}}
							>
								{column.header}
							</span>
							<span class='text-xs'>
								{#if column.isSorted()}
									{#if column.getSortingDirection() === 'asc'}
										▲
									{:else if column.getSortingDirection() === 'desc'}
										▼
									{:else}
										&nbsp;
									{/if}
								{/if}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid-body">
			{#each grid.rows as row}
				{#if row.groupId}
					<div class="grid-row">
						{#each grid.columns as column, colIndex}
							<div
								class="grid-cell overflow-hidden text-ellipsis"
								style:--offset={column.pinning.offset + 'px'}
								style={`${column.cell && column.cell.style && column.cell.style(row)}; ${column.size.grow === false ? `--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'};`: `flex-grow: 1;`};  --min-width: ${column.size.width + 'px'};`}

							>
								{#if column.columnId === row.columnId && Object.keys(row.aggregates).find((key) => key === column.columnId)}
									<!-- <span>{column.accessor(row)}</span> -->
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
					<div
						class="grid-row  {grid.rowManager.isPinned(String(row?.original?.id), 'top')
							? 'sticky top-0 bg-red-400'
							: ''}"
					>
						{#each grid.columnManager.getVisibleColumns() as column}
							<div
								class={`grid-cell last:bg-blue-400 text-ellipsis text-nowrap ${column.pinning.position === 'left' && 'offset-left'} ${column.pinning.position === 'right' && 'offset-right'}`}
								style:--offset={column.pinning.offset + 'px'}
								style={`${column.cell && column.cell.style && column.cell.style(row)}; ${column.size.grow === false ? `--width: ${column.size.width + 'px'}; --max-width: ${column.size.width + 'px'};`: `flex-grow: 1;`};  --min-width: ${column.size.width + 'px'};`}
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
<div class="pagination">
	<div>
		Showing: {grid.pagination.page * grid.pagination.pageSize - grid.pagination.pageSize}
		to {grid.pagination.page * grid.pagination.pageSize} of {grid.pagination.count}
	</div>
	<button
		disabled={grid.pagination.canPrevPage()}
		onclick={() => grid.refresh(() => grid.pagination.goToPrevPage())}
	>
		Previous
	</button>
	<span>Page {grid.pagination.page}</span>
	<button
		disabled={grid.pagination.canNextPage()}
		onclick={() => grid.refresh(() => grid.pagination.goToNextPage())}
	>
		Next
	</button>
	<select
		value={grid.pagination.pageSize}
		onchange={(e) => {
			grid.refresh(() => grid.pagination.updatePageSize(Number(e.currentTarget.value)));

			// setPageSize(Number(e.currentTarget.value));
		}}
	>
		{#each grid.pagination.pageSizes as pageSize}
			<option value={pageSize}>{pageSize}</option>
		{/each}
	</select>
	{grid.pagination.pageCount}
</div>

<!-- Pagination controls -->


<style>
	.grid-header-row {
		background-color: hsl(var(--grid-header-row-background));
		display: flex;
		border-bottom: 1px solid hsl(var(--grid-border));
		border-left: 1px solid hsl(var(--grid-border));
		border-right: 1px solid hsl(var(--grid-border));
		border-top: 1px solid hsl(var(--grid-border));
	}

	.grid-header-cell {
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
		padding: 0.5rem 0.5rem;
		border-right: 1px solid hsl(var(--grid-border));
	}
	
	.grid-header-cell:last-child {
		flex-grow: 1;
		border-right: none;
	}

	.grid-row {
		display: flex;
		border-bottom: 1px solid hsl(var(--grid-border));
		border-left: 1px solid hsl(var(--grid-border));
		border-right: 1px solid hsl(var(--grid-border));
	}

	.grid-row:nth-child(odd) {
		background-color: hsl(var(--grid-row-odd-background)); /* Customize for odd rows */
	}

	.grid-row:hover:nth-child(odd) {
		background-color: hsl(var(--grid-row-odd-background-hover)); /* Customize for odd rows */
	}

	.grid-row:nth-child(even) {
		background-color: hsl(var(--grid-row-even-background)); /* Customize for even rows */
	}

	.grid-row:hover:nth-child(even) {
		background-color: hsl(var(--grid-row-even-background-hover)); /* Customize for even rows */
	}

	.grid-cell {
		border-right: 1px solid hsl(var(--grid-border));
		width: var(--width);
		max-width: var(--max-width);
		min-width: var(--min-width);
		padding: 0.5rem 0.5rem;
		cursor: pointer;
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

	.group-toggle {
		margin-right: 0.5rem;
	}

	.pagination {
		border-bottom: 1px solid hsl(var(--grid-border));
		border-left: 1px solid hsl(var(--grid-border));
		border-right: 1px solid hsl(var(--grid-border));
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.5rem 0rem;
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
