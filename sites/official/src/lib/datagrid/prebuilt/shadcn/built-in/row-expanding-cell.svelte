<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { AnyColumn, CustomCellProps, GridBasicRow, GridRow } from '$lib/datagrid/core/types';
	import ExpandMoreSqureLine from '$lib/datagrid/icons/si/expand-more-squre-line.svelte';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	import { cn } from '$lib/utils';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import CellWithoutColumn from '../headless-structure/body/row/cell/cell-without-column.svelte';
	import Cell from '../headless-structure/body/row/cell/cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
		row: GridBasicRow<any>;
	};

	let { datagrid, row }: Props = $props();

	const handleClick = () => {
		datagrid.handlers.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<CellWithoutColumn {datagrid} {row} class="pr-3 border-r">
		<button onclick={handleClick} class="border-primary rounded-sm border">
			<ExpandMoreSqureLine
				class={cn('size-4 p-0.5 transition-all ', row.isExpanded() ? 'rotate-180' : '')}
			/>
		</button>
</CellWithoutColumn>
