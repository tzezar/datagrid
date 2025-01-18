<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import LayoutNavbarExpandFilled from '$lib/datagrid/icons/tabler/layout-navbar-expand-filled.svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import Cell from '../structure/body/row/cell/cell.svelte';
	import BodyRowActionsCellDropdownMenuWithOptions from './body-row-actions-cell-dropdown-menu-with-options.svelte';

	let {
		row,
		column,
		datagrid
	}: { row: GridBasicRow<any>; column: LeafColumn<any>; datagrid: TzezarsDatagrid<any> } = $props();

	const handleClick = () => {
		datagrid.handlers.rowExpanding.toggleRowExpansion(row.identifier);
	};
</script>

<Cell {datagrid} {row} {column}>
	<div class="flex gap-2 justify-center items-center">
		<button onclick={handleClick}>
			<LayoutNavbarExpandFilled
			class={`${row.isExpanded() ? 'rotate-180' : ''} transition-all`}
			/>
		</button>
		<BodyRowActionsCellDropdownMenuWithOptions {row} {column} {datagrid} />
	</div>
</Cell>