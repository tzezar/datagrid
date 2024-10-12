<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { Z_INDEX_ROW } from './CONSTSANTS';

	let {
		rowId,
		children,
		class: _class,
		rowIndex
	}: {
		rowId?: number;
		children: Snippet;
		class?: string;
		rowIndex?: number;
	} = $props();

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<div
	style={`${rowId && datagrid?.state.expandedRows.includes(rowId as number | string) ? `position: sticky; top: ${datagrid.internal.headSize}px;` : ''}`}
	class={cn(`group/row z-[${Z_INDEX_ROW}] flex min-w-fit flex-row border-b last:border-b-0`, _class)}
>
	{#if children}
		{@render children()}
	{/if}
</div>
