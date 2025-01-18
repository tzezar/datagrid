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
	let selected = $state(datagrid.features.rowSelection.isRowSelected(row.identifier));
</script>

<CellWithoutColumn {datagrid} {row}>
	<div class="flex items-center">
		<Checkbox
			bind:checked={selected}
			onCheckedChange={() => {
				datagrid.extra.features.rowSelection.toggleRowSelection(row.identifier);
				// workaround for shadcn svelte behaviour that doesn't update the checkbox state to properly reflect the row selection
				selected = datagrid.features.rowSelection.isRowSelected(row.identifier);
			}}
		/>
	</div>
</CellWithoutColumn>
