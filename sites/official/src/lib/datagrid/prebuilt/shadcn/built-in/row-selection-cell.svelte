<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type {
		AnyColumn,
		CustomCellProps,
		GridBasicRow,
		GridRow,
		LeafColumn
	} from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import CellWithoutColumn from '../headless-structure/body/row/cell/cell-without-column.svelte';
	import Cell from '../headless-structure/body/row/cell/cell.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
	};

	let { datagrid, row, column }: Props = $props();

	// I am not able to make it work with shadcn svelte checkbox
	// it doesn't update the checkbox state to properly reflect the row selection
	// so it does not play well with the row selection feature that allows multi selection
	// or single selection depending on the configuration
</script>

<Cell {datagrid} {row} {column} class=" m-0 items-center justify-center p-0">
	<input
		class="m-0 mx-auto size-4 p-0"
		type="checkbox"
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		onchange={(e) => {
			if (e.currentTarget.checked) {
				datagrid.extra.features.rowSelection.selectRow(row.identifier);
			} else {
				datagrid.extra.features.rowSelection.unselectRow(row.identifier);
			}
			e.currentTarget.checked = datagrid.features.rowSelection.isRowSelected(row.identifier);
		}}
	/>
</Cell>
