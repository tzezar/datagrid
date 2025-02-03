<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import type { EnhancedColumnMeta } from '../core/types';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any, EnhancedColumnMeta>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, column, children, class: _class }: Props = $props();
</script>

<div
	class={cn(
		datagrid.customization.styling.getHeadRowLeafColumnCellClasses(),
		column._meta.grow === true && 'grow ',
		'shrink-0'
	)}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
>
	{@render children()}
</div>
