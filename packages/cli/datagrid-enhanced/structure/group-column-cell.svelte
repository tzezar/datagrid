<script lang="ts">
	import type { ColumnGroup } from '$lib/datagrid/core/types';
	import type { Snippet } from 'svelte';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		datagrid: EnhancedDatagrid;
		column: ColumnGroup<any>;
		children: Snippet;
		class?: string;
	};

	let { datagrid, column, children, class: _class }: Props = $props();
</script>

<div class={cn(datagrid.customization.styling.getHeadRowGroupColumnCellClasses(), 'shrink-0')}>
	{@render children()}
</div>
