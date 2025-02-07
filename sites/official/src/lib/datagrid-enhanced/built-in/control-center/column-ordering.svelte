<script lang="ts">
	import type { AnyColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../../core/index.svelte';
	import DeleteOutline from '$lib/datagrid/icons/material-symbols/delete-outline.svelte';
	import ColumnGrouping from './column-grouping.svelte';
	import Ordering from './column-ordering.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		columns: AnyColumn<any>[];
		depth: number;
	};

	let { datagrid, columns, depth = 0 }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	{#each columns as column (column.columnId)}
		{#if column.type === 'group'}
			<div class="flex gap-4 rounded-md border p-4">
				<div class="flex flex-col gap-2">
					<div class="flex w-full flex-row justify-between gap-4">
						<span class="text-xs font-bold">{column.header}</span>
						<button onclick={() => datagrid.handlers.column.deleteGroupColumn(column)}>
							<DeleteOutline />
						</button>
					</div>
					<ColumnGrouping {datagrid} {column} />
				</div>
				<Ordering {datagrid} columns={column.columns} depth={depth + 1} />
			</div>
		{:else}
			<div class="flex flex-col gap-2 rounded-md border p-4">
				<span class="text-xs font-bold">{column.header}</span>
				<ColumnGrouping {datagrid} {column} />
			</div>
		{/if}
	{/each}
</div>
