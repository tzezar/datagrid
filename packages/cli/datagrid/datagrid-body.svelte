<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import Row from './row.svelte';
	import Cell from './cell.svelte';

	let { body }: { body: Snippet | undefined } = $props();

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	// ? BODY can not be wrapped inside html element, it break sticky and rows
	// ? there is possibility to move other elements like header, topbar etc to ouside of parent container
	// ? but then header and body X axis scroll have to be synced via js
</script>

{#if body}
	{@render body()}
{:else}
	{#each datagrid.internal.paginatedData as row, rowIndex}
		<Row {rowIndex}>
			{#each datagrid.columns as column, columnIndex}
				<Cell {columnIndex} {rowIndex} {column} {row} />
			{/each}
		</Row>
	{/each}
{/if}
