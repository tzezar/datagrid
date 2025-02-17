<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import ExpandMore from '$lib/datagrid/icons/material-symbols/expand-more.svelte';
	import ExpandMoreSqureLine from '$lib/datagrid/icons/si/expand-more-squre-line.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		datagrid: DatagridCore<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();

	const handleClick = () => {
		datagrid.handlers.rows.toggleRowExpansion(row.identifier);
	};
</script>

<button
	onclick={() => datagrid.handlers.rows.toggleRowExpansion(row.identifier)}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	class={cn('td gap-2 px-4 py-2 ', column._meta.grow && '!max-w-full !grow')}
>
	<ExpandMoreSqureLine
		class={cn('size-4 p-0.5 transition-all ', row.isExpanded() ? 'rotate-180' : '')}
	/>
</button>

<style>
	.td {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
	}

	.td {
		background: hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
