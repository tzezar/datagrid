<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		datagrid: TzezarsDatagrid;
		column: GroupColumn<any>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, column, children, class: _class }: Props = $props();
</script>

<div class={cn(datagrid.extra.features.customization.getHeadRowGroupColumnCellClasses(), 'shrink-0')}>
	{@render children()}
</div>
