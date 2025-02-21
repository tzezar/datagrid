<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import type { ColumnMetaEnhanced } from '../core/types';

	type Props = {
		datagrid: EnhancedDatagrid;
		column: LeafColumn<any, ColumnMetaEnhanced>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, column, children, class: _class }: Props = $props();
</script>

<div
	class={cn(
		datagrid.customization.styling.getHeadRowLeafColumnCellClasses(),
		column._meta.grow === true && 'grow ',
		'shrink-0',
		_class
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
