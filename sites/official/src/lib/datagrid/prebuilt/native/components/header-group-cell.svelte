<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		datagrid: Datagrid<any>;
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
