<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { PinningPosition } from '$lib/datagrid/core/types';
	import { filterOutGroupColumns, flattenColumns } from '$lib/datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	function handleColumnPinningChange(column: any, position: PinningPosition) {
		datagrid.columnPinning.changeColumnPinningPosition(column, position);
		datagrid.processors.column.refreshColumnPinningOffsets();
	}
</script>

<div class="flex flex-col pb-6">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>Colum pinning:</label>
	<div class="border p-2">
		{#each filterOutGroupColumns(flattenColumns(datagrid.columns)) as column}
			<div class="flex max-w-[200px] flex-row justify-between gap-2">
				{column.header}
				<select
					value={column.state.pinning.position}
					disabled={column.options.pinnable === false}
					onchange={(e) =>
						handleColumnPinningChange(column, e.currentTarget.value as PinningPosition)}
				>
					<option value="none">none</option>
					<option value="left">left</option>
					<option value="right">right</option>
				</select>
			</div>
		{/each}
	</div>
</div>