<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { CustomCellProps } from '$lib/datagrid/core/types';
	import Cell from '../structure/body/row/cell/cell.svelte';

	let { column, datagrid, row }: CustomCellProps<any> = $props();
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