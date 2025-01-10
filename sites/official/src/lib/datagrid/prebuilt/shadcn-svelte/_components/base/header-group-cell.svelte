<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: DataGrid<any>;
		column: GroupColumn<any>;
		children: Snippet;
	};
	let { datagrid, column, children }: Props = $props();
</script>

<!-- data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null} -->
<div
	class={`grid-header-group text-xs font-medium `}
>
	{@render children()}
</div>
