<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: GroupColumn<any>;
		children: Snippet;
	};
	let { datagrid, column, children }: Props = $props();
</script>

<div
	class={`grid-header-group text-xs font-medium `}
>
	{@render children()}
</div>
