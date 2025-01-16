<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import type { AnyColumn } from '$lib/datagrid/core/types';

	type Props = {
		children: Snippet<[headerColumns: AnyColumn<any>[]]>;
		datagrid: TzezarsDatagrid;
	};
	let { datagrid, children }: Props = $props();

	let headerColumns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);
</script>

<div class="grid-header">
	{@render children(headerColumns)}
</div>
