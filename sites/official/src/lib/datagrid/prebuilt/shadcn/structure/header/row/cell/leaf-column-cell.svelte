<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		column: LeafColumn<any>;
		children: Snippet;
	};
	let { column, children }: Props = $props();
</script>

<div
	class={cn('grid-header-cell')}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
>
	{@render children()}
</div>
