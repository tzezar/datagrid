<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		column: LeafColumn<any>;
		datagrid: any;

		caption?: Snippet<[columnHeader: string]>;
		dropdown?: Snippet<[column: LeafColumn<any>, datagrid: TzezarsDatagrid]>;
	};
	let { column, datagrid, caption, dropdown }: Props = $props();
</script>

{#if column.headerCell}
	{@const cellContent = column.headerCell({ datagrid, column })}
	{#if typeof cellContent === 'string'}
		{@html cellContent}
	{:else if isCellComponent(cellContent)}
		<cellContent.component {datagrid} {column} />
	{/if}
{:else if caption}
	{@render caption(column.header)}
{:else}
	<span class="grid-header-cell-content-header">{column.header}</span>
{/if}

