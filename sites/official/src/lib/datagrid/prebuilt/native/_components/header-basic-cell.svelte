<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: LeafColumn<any>;
		children: Snippet;
	};
	let { datagrid, column, children }: Props = $props();
</script>

<div
	class={cn('grid-header-cell h-fit justify-end self-end border-t text-xs font-medium')}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
>
	{@render children()}
</div>
