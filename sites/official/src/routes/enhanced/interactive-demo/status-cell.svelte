<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';
	import Cell from '$lib/datagrid-enhanced/structure/cell.svelte';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();


	let value = $derived(row.original[column.columnId]);

</script>

<Cell {datagrid} {row} {column}>
	<Badge class={cn(value === 'low-stock' && 'bg-red-400')}>{value}</Badge>
</Cell>
