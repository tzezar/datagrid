<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: GroupColumn<any>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, column, children, class: _class }: Props = $props();
</script>

<div class={datagrid.extra.features.customization.getHeadRowGroupColumnCellClasses()}>
	{@render children()}
</div>
