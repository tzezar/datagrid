<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';

	type Props = {
		datagrid: DatagridCore<any>;
		column: LeafColumn<any>;
		row: GridGroupRow<any>;
	};
	let { datagrid, row }: Props = $props();
</script>

<div class="flex flex-col place-items-start justify-start gap-1">
	<span class="text-muted-foreground flex place-items-center text-xs">
		({row.children.length} items)
	</span>
	<button class="flex gap-1" onclick={() => datagrid.rows.toggleGroupRowExpansion(row)}>
		<span class="border-primary/30 rounded-sm border-[1px]">
			<ArrowRight
				class={`${row.isExpanded() && 'rotate-90'} transition-all `}
			/>
		</span>
		<span class="">
			Custom Grouped Cell
			{row.groupValue[0]}
		</span>
	</button>
</div>
