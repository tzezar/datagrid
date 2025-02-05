<script lang="ts">
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { Snippet } from 'svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';

	type Props = {
		datagrid: DatagridCore<any>;
		column: AnyColumn<any>;
		groupCell: Snippet<[column: GroupColumn<any>]>;
		cell: Snippet<[column: LeafColumn<any>]>;
	};
	const { datagrid, column, groupCell, cell }: Props = $props();
</script>

{#if isGroupColumn(column)}
	{@render groupCell(column)}
{:else if column.state.visible === true}
	{@render cell(column)}
{/if}
