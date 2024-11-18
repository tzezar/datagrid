<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';

	import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';
	import CellRenderer from '$lib/tzezars-datagrid/core/utils/cell-renderer.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		column,
		grid,
		row
	}: { children?: Snippet; column: Column<any>; grid: Datagrid<any, any>; row: any } = $props();
</script>

<div
	class="grid-cell text-ellipsis text-nowrap"
	class:justify-end={column.align === 'end'}
	class:justify-center={column.align === 'center'}
	class:justify-start={column.align === 'start'}
	class:offset-left={column.pinning.position === 'left'}
	class:offset-right={column.pinning.position === 'right'}
	style:--offset="{column.pinning.offset}px"
	style:--min-width="{column.size.minWidth}px"
	style:--width={!column.size.grow ? `${column.size.width}px` : null}
	style:--max-width={!column.size.grow ? `${column.size.width}px` : null}
	style:flex-grow={column.size.grow ? 1 : null}
>
	<CellRenderer {column} {row} {grid} />
</div>
