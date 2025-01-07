<script lang="ts">
	import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn } from "$lib/datagrid/core/helpers/column-creators";
	import type { Datagrid } from "$lib/datagrid/core/index.svelte";
	import type { GridBasicRow } from "$lib/datagrid/core/types";
	import { getCellContent } from "$lib/datagrid/core/utils.svelte";


	let { datagrid, column, row }: { datagrid: Datagrid<any>; column: (AccessorColumn<any> | ComputedColumn<any> | DisplayColumn<any>); row: GridBasicRow<any> } =
		$props();
</script>

<div
	class="grid-body-cell"
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{#if column.cell && typeof column.cell === 'function'}
		{@const cellContent = column.cell(row)}
		{#if cellContent && typeof cellContent === 'object' && 'component' in cellContent}
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
		{/if}
	{:else}
		{@html getCellContent(column, row.original)}
	{/if}
</div>
