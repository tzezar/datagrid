<script lang="ts">
	import type { Datagrid } from '../../datagrid/core/index.svelte';
	import type { PinningPosition } from '../../datagrid/core/types';
	import { filterOutGroupColumns, flattenColumns } from '../../datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

<div class="flex flex-col pb-6">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>Colum pinning:</label>
	<div class="border p-2">
		{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
			<div class="flex max-w-[200px] flex-row justify-between gap-2">
				{column.header}

				<input
					type="range"
					min={column.state.size.minWidth}
					max={column.state.size.maxWidth}
					value={column.state.size.width}
					oninput={(e) => {
						datagrid.columnSizing.setColumnSize(column.columnId, Number(e.currentTarget.value));
						datagrid.processors.column.refreshColumnPinningOffsets();
					}}
				/>
			</div>
		{/each}
	</div>
</div>
