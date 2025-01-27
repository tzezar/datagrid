<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		column: LeafColumn<any>;
		children: Snippet;
		class?: string;
	};

	let { column, children, class: _class }: Props = $props();
</script>

<div
	class={cn('cell !p-0')}
	class:justify-center={column?._meta?.align === 'center'}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{@render children()}
</div>
