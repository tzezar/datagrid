<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
		datagrid: TzezarsDatagrid;
	};
	let { column, row, datagrid }: Props = $props();
</script>

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
