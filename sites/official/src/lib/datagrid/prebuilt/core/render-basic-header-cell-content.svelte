<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: Datagrid<any>;
		column: LeafColumn<any>;
		title: Snippet<[string]>;
	};

	let { datagrid, column, title }: Props = $props();
</script>

{#if column.headerCell}
	{@const cellContent = column.headerCell({ datagrid, column })}
	{#if typeof cellContent === 'string'}
		{@html cellContent}
	{:else if isCellComponent(cellContent)}
		<cellContent.component {datagrid} {column} />
	{/if}
{:else}
    {#if title === undefined}
        {column.header}
    {:else}
        {@render title(column.header)}
    {/if}
{/if}
