<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory.js';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { LeafColumn, GridBasicRow } from '$lib/datagrid/core/types';
	import { page } from '$app/stores';
	import './styles.css'

	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	export const columns = [
		accessorColumn({ accessorKey: 'id' }),
		accessorColumn({
			accessorKey: 'name',
			_meta: { grow: true }
		}),
		accessorColumn({ accessorKey: 'category' }),
		accessorColumn({ accessorKey: 'price.retail' }),
		accessorColumn({ accessorKey: 'status' })
	] satisfies ColumnDef<InventoryItem, EnhancedMeta>[];

	let {
		data
	}: {
		data: {
			inventory: InventoryItem[];
			totalCount: number;
			currentPage: number;
			pageSize: number;
		};
	} = $props();

	const datagrid = new DatagridCore({
		columns: columns,
		data: data.inventory,

		initialState: {
			pagination: {
				manual: true,
				page: data.currentPage,
				pageSize: data.pageSize,
				totalCount: data.totalCount,
				pageCount: Math.ceil(data.totalCount / data.pageSize)
			}
		}
	});


	datagrid.processors.data.executeFullDataTransformation();


	type LoadingState = 'loading' | 'success';

	let loadingState: LoadingState = $state('loading');

	const updateQueryParams = (updates: Record<string, string>) => {
		const params = new URLSearchParams($page.url.search);
		Object.entries(updates).forEach(([key, value]) => params.set(key, value));
		return `?${params.toString()}`;
	};

	onMount(() => {
		goto(updateQueryParams({ page: String(data.currentPage), pageSize: String(data.pageSize) }), {
			replaceState: true
		});
		loadingState = 'success';
	});

	const handlePaginationChange = async (page: number, pageSize: number) => {
		loadingState = 'loading';

		await goto(updateQueryParams({ page: String(page), pageSize: String(pageSize) }), {
			replaceState: true
		});

		datagrid.originalState.data = data.inventory;
		datagrid.cacheManager.invalidate('everything');
		datagrid.refresh(() => {}, { recalculateAll: true });

		datagrid.features.pagination.page = page;
		datagrid.features.pagination.pageSize = pageSize;
		datagrid.features.pagination.pageCount = data.totalCount / pageSize;

		loadingState = 'success';
	};

	const handlePageChange = (newPage: number) =>
		handlePaginationChange(newPage, datagrid.features.pagination.pageSize);
	const handlePageSizeChange = (newPageSize: number) => handlePaginationChange(1, newPageSize);
</script>

<div class="flex w-full flex-col">
	<div class="wrapper">
		<!-- Table rendering remains similar to previous implementation -->
		<div class="table">
			<div class="thead">
				<div class="flex">
					{#each datagrid.columns.getLeafColumnsInOrder() as column}
						{@render LeafHeader(column)}
					{/each}
				</div>
			</div>
			<div
				class={cn(
					loadingState === 'loading' && 'h-2 bg-blue-400',
					loadingState === 'success' && 'hidden'
				)}
			></div>
			<div class="tbody">
				{#each datagrid.rows.getPaginatedRows() as row}
					<div class="tr">
						{#if !row.isGroupRow()}
							{#each datagrid.columns.getLeafColumnsInOrder() as column}
								{@render RenderBodyCell(column, row)}
							{/each}
						{:else}{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Pagination Controls -->
	<div class="pagination-controls flex !items-center">
		<div class="page-size-selector flex items-center gap-2">
			<span class="text-nowrap">Per page:</span>
			<select
				value={datagrid.features.pagination.pageSize}
				onchange={(e) => handlePageSizeChange(Number(e.currentTarget.value))}
			>
				{#each [10, 25, 50, 100] as pageSize}
					<option value={pageSize}>{pageSize}</option>
				{/each}
			</select>
		</div>

		<div class="pagination-navigation">
			<button
				disabled={datagrid.features.pagination.page <= 1}
				onclick={() => handlePageChange(datagrid.features.pagination.page - 1)}
			>
				Previous
			</button>

			<span class="page-indicator">
				Page {datagrid.features.pagination.page} of {Math.ceil(
					data.totalCount / datagrid.features.pagination.pageSize
				)}
			</span>

			<button
				disabled={datagrid.features.pagination.page >=
					Math.ceil(data.totalCount / datagrid.features.pagination.pageSize)}
				onclick={() => handlePageChange(datagrid.features.pagination.page + 1)}
			>
				Next
			</button>
		</div>

		<div class="row-range-display">
			Showing
			{(datagrid.features.pagination.page - 1) * datagrid.features.pagination.pageSize + 1}
			to
			{Math.min(
				datagrid.features.pagination.page * datagrid.features.pagination.pageSize,
				data.totalCount
			)}
			of {data.totalCount} rows
		</div>
	</div>

	<pre>{JSON.stringify(
			{
				page: datagrid.features.pagination.page,
				pageSize: datagrid.features.pagination.pageSize,
				pageSizes: datagrid.features.pagination.pageSizes,
				pageCount: datagrid.features.pagination.pageCount
			},
			null,
			2
		)}</pre>
</div>

{#snippet RenderBodyCell(column: LeafColumn<any>, row: GridBasicRow<any>)}
	<div
		style:--width={column.state.size.width + 'px'}
		style:--min-width={column.state.size.minWidth + 'px'}
		style:--max-width={column.state.size.maxWidth + 'px'}
		class={cn('td  min-w-40 max-w-40  gap-2 px-4 py-2 ', column._meta.grow && '!max-w-full !grow')}
	>
		{getCellContent(column, row.original)}
	</div>
{/snippet}

{#snippet LeafHeader(column: LeafColumn<any>)}
	{#if column.isVisible()}
		<div
			class={cn('th min-w-40 max-w-40  gap-2 px-4 py-2', column._meta.grow && '!max-w-full !grow')}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<div class="flex justify-between self-center">
				{column.header}
			</div>
		</div>
	{/if}
{/snippet}

