<script lang="ts">
	import { generateData } from '$lib/data-generators/generate-data';
	import {
		generateInventoryItem,
		type InventoryItem
	} from '$lib/data-generators/generate/inventory.js';
	import { generateSimpleUser, type SimpleUser } from '$lib/data-generators/generate/simple-user';
	import { generateUser, type User } from '$lib/data-generators/generate/user';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import {
		accessorColumn,
		DatagridCore,
		getCellContent,
		type ColumnDef
	} from '$lib/datagrid/index.js';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import Pagination from '../../_blocks/pagination.svelte';
	import SortingIndicator from '../../_blocks/sorting-indicator.svelte';

	import { VirtualList } from 'svelte-virtuallists';

	export const columns = [
		accessorColumn({
			accessorKey: 'id'
		}),
		accessorColumn({
			accessorKey: 'firstName',
			_meta: {
				grow: true
			},
			options: {
				sortable: false
			}
		}),
		accessorColumn({
			accessorKey: 'lastName'
		}),
		accessorColumn({
			accessorKey: 'age'
		}),
		accessorColumn({
			accessorKey: 'email'
		}),
		accessorColumn({
			accessorKey: 'country'
		})
	] satisfies ColumnDef<SimpleUser, EnhancedMeta>[];

	import { tick } from 'svelte';
	import { writable } from 'svelte/store';

	let test = writable<SimpleUser[]>([]);

	const generateDataInBatches = (
		generator: () => SimpleUser,
		total: number,
		batchSize: number,
		callback: (batch: SimpleUser[]) => void
	) => {
		let generated = 0;

		const generateBatch = () => {
			if (generated >= total) return;

			const batch = generateData(generator, batchSize);
			callback(batch);
			generated += batchSize;

			setTimeout(generateBatch, 0); // Use setTimeout to prevent freezing
		};

		generateBatch();
	};

	onMount(async () => {
		// @ts-expect-error Argument of type
		generateDataInBatches(generateSimpleUser, 1_000_000, 10_000, async (batch) => {
			test.update((data) => [...data, ...batch]); // Store update for reactivity
			await tick(); // Ensure DOM updates before continuing
		});

		let timeEnd = performance.now();
	});

	const datagrid = new DatagridCore({
		columns,
		data: [],
		initialState: {
			pagination: {
				pageSize: 1_000,
				pageSizes: [1_000, 5_000, 10_000, 50_000, 100_000]
			}
		}
	});

	let counter = 1;

	test.subscribe((data) => {
		counter += 1;
		if (counter < 10) return;
		datagrid.originalState.data = data;
		datagrid.cacheManager.invalidate('everything');
		datagrid.refresh(() => {}, { recalculateAll: true });

		counter = 1;
	});
</script>

<div class="flex w-full flex-col">
	<div class="wrapper w-full overflow-auto">
		<VirtualList
			items={datagrid.rows.getPaginatedRows()}
			style="height:600px; position:relative; overflow:auto;"
		>
			{#snippet header()}
				<div class="thead">
					<div class="flex">
						{#each datagrid.columns.getLeafColumnsInOrder() as column}
							{@render LeafHeader(column)}
						{/each}
					</div>
				</div>
			{/snippet}
			{#snippet vl_slot({ index, item })}
				<div class="tr">
					{#if !item.isGroupRow()}
						{#each datagrid.columns.getLeafColumnsInOrder() as column}
							{@render RenderBodyCell(column, item)}
						{/each}
					{:else}{/if}
				</div>
			{/snippet}
		</VirtualList>
		<Pagination {datagrid} />
	</div>
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
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={(e) => datagrid.handlers.sorting.toggleColumnSort(column, e.ctrlKey)}
			class={cn(
				'th flex min-w-40  max-w-40 items-center justify-between gap-2 px-4 py-2',
				column._meta.grow && '!max-w-full !grow',
				column.isSortable() && 'cursor-pointer'
			)}
			style:--width={column.state.size.width + 'px'}
			style:--min-width={column.state.size.minWidth + 'px'}
			style:--max-width={column.state.size.maxWidth + 'px'}
		>
			<div class="flex justify-between self-center">
				{column.header}
			</div>
			{#if column.isSortable()}
				<SortingIndicator {datagrid} {column} />
			{/if}
		</div>
	{/if}
{/snippet}

<style lang="postcss">
	.th,
	.td {
		@apply leading-relaxed;
		width: var(--width);
		min-width: 200;
		max-width: var(--max-width);
	}

	:global(.vtlist) {
	}

	:global(.vtlist-inner) {
		@apply !flex w-full min-w-full;
	}

	.tr {
		@apply flex;
	}
	.thead {
		@apply bg-background sticky top-0;
	}

	.td {
		@apply overflow-hidden text-ellipsis text-nowrap px-4 py-1 align-top;
	}

	.wrapper,
	.th,
	.td {
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
