<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import ColumnFilter from '../../native/column-filter.svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: LeafColumn<any>;
	};

	let { datagrid, column }: Props = $props();
</script>

{#if datagrid.features.filtering.showColumnFiltering}
	<div class="h-9 w-full pt-1">
		<ColumnFilter {datagrid} {column} />
	</div>
{/if}
