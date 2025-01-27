<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type {  GridBasicRow,  LeafColumn } from '$lib/datagrid/core/types'; 
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import Cell from '../structure/cell.svelte';

	type Props = {
		column: LeafColumn<any>;
		datagrid: TzezarsDatagrid<any>;
		row: GridBasicRow<any>
	}

	let { column, datagrid, row }: Props = $props();
</script>


<Cell {datagrid} {row} {column}>
	<div class="flex items-center">
		<Checkbox
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		onCheckedChange={() => datagrid.features.rowSelection.toggleRowSelection(row.identifier)}
		/>
		<!-- <input
		type="checkbox"
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		onchange={() => datagrid.features.rowSelection.toggleRowSelection(row.identifier)}
		/> -->
	</div>
</Cell>