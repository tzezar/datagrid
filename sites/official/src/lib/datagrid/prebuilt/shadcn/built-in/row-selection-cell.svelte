<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { AnyColumn, CustomCellProps, GridBasicRow, GridRow } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import CellWithoutColumn from '../structure/body/row/cell/cell-without-column.svelte';
	import Cell from '../structure/body/row/cell/cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
		row: GridBasicRow<any>;
	};

	let { datagrid, row }: Props = $props();
	
</script>

<CellWithoutColumn {datagrid} {row}>
	<div class="flex items-center">
		<Checkbox
			checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
			onCheckedChange={() => datagrid.features.rowSelection.toggleRowSelection(row.identifier)}
		/>
	</div>
</CellWithoutColumn>
