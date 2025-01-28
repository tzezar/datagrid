<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import { shouldHighlightSelectedRow } from '../utils';
	import { identifier } from '../actions.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, row, column, children, class: _class }: Props = $props();
</script>

<div
	use:identifier={{ datagrid, value: `${row.identifier}-${column.columnId}` }}
	class:grow={column?._meta?.grow}
	class={cn(
		datagrid.extra.features.customization.getBodyRowCellClasses(),
		'group',
		shouldHighlightSelectedRow(datagrid, row) && 'bg-blue-400/10',
		column._meta.styles?.bodyCell({ datagrid, column, row }),
		_class
	)}
	class:justify-center={column?._meta?.align === 'center'}
	data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : 'none'}
	style:--width={column.state.size.width + 'px'}
	style:--min-width={column.state.size.minWidth + 'px'}
	style:--max-width={column.state.size.maxWidth + 'px'}
	style:--pin-left-offset={column.state.pinning.offset + 'px'}
	style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
	{@render children()}
</div>
