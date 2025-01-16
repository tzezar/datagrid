<script lang="ts">
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { Snippet } from 'svelte';
	import BasicRow from './basic-row.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		row: GridBasicRow<any>;
		columns: LeafColumn<any>[];

		children?: Snippet<[row: GridBasicRow<any>]>;
	};
	let { datagrid, row, columns, children }: Props = $props();
</script>

{#if row.isExpanded()}
	<BasicRow {datagrid} {row} leafColumns={columns}>
		<div class="grid-body-cell">
			{#if children}
				{@render children(row)}
			{/if}
		</div>
	</BasicRow>
{/if}
