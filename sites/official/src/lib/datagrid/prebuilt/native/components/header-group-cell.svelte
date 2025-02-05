<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DatagridCore<any>;
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
