<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		datagrid: TzezarsDatagrid;
		children: Snippet<[leafColumns: LeafColumn<any>[]]>;
	};
	let { children, datagrid }: Props = $props();

	const leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
</script>

<div class="grid-body">
	{@render children(leafColumns)}
</div>
