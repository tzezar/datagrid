<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import ExpandMoreSqureLine from '$lib/datagrid/icons/si/expand-more-squre-line.svelte';
	import { cn } from '$lib/utils';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import Cell from '../structure/cell.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();

	const handleClick = () => {
		datagrid.handlers.rows.toggleRowExpansion(row.identifier);
	};
</script>

<Cell {datagrid} {row} {column} class="place-content-center">
	<!-- <CellWithoutColumn {datagrid} {row} class="pr-3 border-r w-10"> -->
	<button onclick={handleClick} class="m-0 h-fit self-center rounded-sm border border-primary p-0">
		<ExpandMoreSqureLine
			class={cn('size-4 p-0.5 transition-all ', row.isExpanded() ? 'rotate-180' : '')}
		/>
	</button>
	<!-- </CellWithoutColumn> -->
</Cell>
