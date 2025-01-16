<script lang="ts">
	import type { AnyColumn, GroupColumn, LeafColumn } from '$lib/datagrid/core/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { Snippet } from 'svelte';

	type Props = {
		columns: AnyColumn<any>[];

		groupCell: Snippet<[column: GroupColumn<any>]>;
		leafCell: Snippet<[column: LeafColumn<any>]>;
	};
	let { columns, groupCell, leafCell }: Props = $props();

</script>

<div class="flex grow flex-row">
	{#each columns ?? [] as childColumn (childColumn.columnId)}
		{#if isGroupColumn(childColumn)}
			{@render groupCell(childColumn)}
		{:else}
			{@render leafCell(childColumn)}
		{/if}
	{/each}
</div>
