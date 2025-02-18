<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DatagridCore } from '../core/index.svelte';
	import type { GridBasicRow, LeafColumn } from '../core/types';
	import { getCellContent, isCellComponent } from '../core/utils.svelte';

	type Props = {
		datagrid: DatagridCore;
		row: GridBasicRow<any>;
		column: LeafColumn<any>;
		children?: Snippet;
	};

	let { datagrid, row, column, children }: Props = $props();

	let cellContent = getCellContent(column, row.original);
</script>

{#if cellContent}
	{#if typeof cellContent === 'string'}
		{@html cellContent}
	{:else if isCellComponent(cellContent)}
		<cellContent.component {datagrid} {row} {column} />
	{/if}
{:else if children}
	{@render children()}
{:else}
	<span>
		{@html getCellContent(column, row.original)}
	</span>
{/if}
