<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { Z_INDEX_ROW } from './CONSTSANTS';

	let {
		rowId,
		children,
		class: _class,
		disableTailwindGroup = false,
		rowIndex,
		...restProps
	}: {
		rowId?: number | string;
		children: Snippet;
		class?: string;
		rowIndex?: number;
		disableTailwindGroup?: boolean;
	} = $props();

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<div
	{...restProps}
	style={`${rowId && datagrid?.state.expandedRows.includes(rowId as number | string) ? `position: sticky; top: ${datagrid.internal.headSize}px;` : ''}`}
	class={cn( 
		!disableTailwindGroup && 'group/row',
		` z-[${Z_INDEX_ROW}] flex min-w-fit flex-row border-b last:border-b-0`,
		_class
	)}
>
	{#if children}
		{@render children()}
	{/if}
</div>
