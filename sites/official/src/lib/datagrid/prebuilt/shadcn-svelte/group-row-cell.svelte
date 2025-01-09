<script lang="ts">
	
	import type { AnyColumn } from "$lib/datagrid/core/column-creation/types";
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow } from '$lib/datagrid/core/types';
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';

	let { datagrid, column, row }: { datagrid: Datagrid<any>; column: AnyColumn<any>; row: GridGroupRow<any> } =
		$props();

		console.log('column', column.columnId)
		console.log('row', row.groupKey)

</script>

<div
	class="grid-body-cell"
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
>
	{#if column._meta?.showInGroupRow}
		{#if column.cell && typeof column.cell === 'function'}
			{@const cellContent = column.cell({column, datagrid, row})}
			{#if cellContent && typeof cellContent === 'object' && 'component' in cellContent}
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
			{/if}
		{/if}
	{/if}
	{#if column.columnId == row.groupKey}
		<div class="flex flex-col place-items-start justify-start gap-1">
			<span class="text-muted-foreground flex place-items-center text-xs">
				({row.children.length} items)
			</span>
			<button class="flex gap-1" onclick={() => datagrid.rowManager.toggleGroupRowExpansion(row)}>
				<span class="border-primary/30 rounded-sm border-[1px]">
					<ArrowRight
						class={`${datagrid.rowManager.isGroupRowExpanded(row) && 'rotate-90'} transition-all `}
					/>
				</span>
				<span class="">
					{row.groupValue[0]}
				</span>
			</button>
		</div>
	{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
		<div class="">
			<div class="text-muted-foreground text-xs">
				{#each row.aggregations.filter((agg) => agg.columnId === column.columnId) as aggregation}
					<p>
						{aggregation.type}: {#if aggregation.type === 'percentChange'}
							{aggregation.value.toFixed(2)}%
						{:else if typeof aggregation.value === 'number'}
							{aggregation.value.toLocaleString()}
						{:else}
							{aggregation.value}
						{/if}
					</p>
				{/each}
			</div>
		</div>
	{/if}
</div>
