<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { Snippet } from 'svelte';
	import RenderCell from './cell/render-cell.svelte';
	import BasicRowExpandable from './basic-row-expandable.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		leafColumns: LeafColumn<any>[];

		children: Snippet<[row: GridBasicRow<any>]>;
	};
	let { datagrid, row, leafColumns, children }: Props = $props();
</script>

<div class="grid-body-row">
	{#if children}
		{@render children(row)}
	{:else}
		{#each leafColumns as column (column.columnId)}
			<RenderCell {datagrid} {row} {column} />
		{/each}
	{/if}
</div>

