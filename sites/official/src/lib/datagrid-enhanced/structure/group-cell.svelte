<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ColumnMetaEnhanced } from '../core/types';

	type Props = {
		column: LeafColumn<any, ColumnMetaEnhanced>;
		children: Snippet;
		class?: string;
	};

	let { column, children, class: _class }: Props = $props();
</script>

<div
	class="cell"
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{@render children()}
</div>

<style>
	.cell {
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);
	}
</style>
